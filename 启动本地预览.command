#!/bin/bash

# Finder 启动时也能找到 Homebrew 安装的 Node.js。
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
cd -- "$(dirname -- "$0")" || exit 1

fail() {
  printf '\n启动失败：%s\n' "$1"
  read -r -p "按回车键关闭窗口……" _reply
  exit 1
}

command -v node >/dev/null 2>&1 || fail "请先安装 Node.js 22.13.0 或更新版本。"
command -v npm >/dev/null 2>&1 || fail "未找到 npm，请检查 Node.js 安装。"
node -e 'const [major, minor] = process.versions.node.split(".").map(Number); process.exit(major > 22 || (major === 22 && minor >= 13) ? 0 : 1)' \
  || fail "当前 Node.js 版本过低，需要 22.13.0 或更新版本。"

if [ ! -d node_modules ]; then
  printf '首次运行，正在安装项目依赖（需要网络）……\n'
  npm ci || fail "依赖安装未完成，请检查网络后重试。"
fi

# 不终止已经运行的预览或其他程序；占用时自动选择下一个端口。
preview_port=3000
while lsof -nP -iTCP:"$preview_port" -sTCP:LISTEN >/dev/null 2>&1; do
  preview_port=$((preview_port + 1))
  [ "$preview_port" -le 3020 ] || fail "3000–3020 端口均已占用。"
done
preview_url="http://localhost:$preview_port/"
printf '\n正在启动 reflex4 本地网站……\n地址：%s\n修改网页后会自动更新。按 Control+C 停止预览。\n\n' "$preview_url"

preview_pid=""
cleanup() {
  if [ -n "$preview_pid" ] && kill -0 "$preview_pid" 2>/dev/null; then
    kill "$preview_pid" 2>/dev/null
    wait "$preview_pid" 2>/dev/null
  fi
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM HUP

node node_modules/next/dist/bin/next dev --hostname 127.0.0.1 --port "$preview_port" &
preview_pid=$!

preview_ready=0
for ((attempt = 0; attempt < 60; attempt++)); do
  kill -0 "$preview_pid" 2>/dev/null || fail "预览服务未能启动，请查看上方错误信息。"
  if curl --noproxy '*' --silent --fail --max-time 2 "http://127.0.0.1:$preview_port/" >/dev/null 2>&1; then
    preview_ready=1
    break
  fi
  sleep 1
done

if [ "$preview_ready" -eq 1 ]; then
  # 可用于终端检查，不影响平时双击自动打开浏览器。
  if [ "${PREVIEW_NO_OPEN:-0}" != "1" ]; then
    open "$preview_url" || printf '请手动打开：%s\n' "$preview_url"
  fi
else
  printf '\n启动比预计慢，请查看上方日志，稍后手动打开：%s\n' "$preview_url"
fi

wait "$preview_pid"
preview_result=$?
preview_pid=""
[ "$preview_result" -eq 0 ] || fail "预览服务已退出，请查看上方日志。"
