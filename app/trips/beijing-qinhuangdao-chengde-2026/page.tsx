import type { Metadata } from "next";
import "./trip.css";

export const metadata: Metadata = {
  title: "山海入承｜2026 夏末旅行计划",
  description: "北京、北戴河、山海关与承德七日旅行计划。",
};

const days = [
  {
    date: "08.30",
    weekday: "周日",
    city: "北京",
    title: "抵达北京，留白休息",
    status: "已确认",
    items: [
      ["09:30", "厦门高崎 T4 起飞", "山东航空 SC2123"],
      ["12:25", "抵达北京首都 T3", "取行李后前往酒店，当天不安排景点"],
      ["下午", "入住北航唯实酒店", "为次日跨城移动保留体力"],
    ],
  },
  {
    date: "08.31",
    weekday: "周一",
    city: "北京 → 北戴河",
    title: "抵达海边，看一场傍晚",
    status: "暂定",
    items: [
      ["11:22", "北京站出发", "暂定 C115 次，建议提前 45—60 分钟到站"],
      ["13:40", "抵达北戴河站", "前往暂定的北戴河喜来登酒店"],
      ["16:00+", "鸽子窝公园", "海岸线、鹰角亭与傍晚光线"],
      ["晚上", "北戴河海鲜", "先确认时价、称重方式和加工费"],
    ],
  },
  {
    date: "09.01",
    weekday: "周二",
    city: "山海关",
    title: "长城从陆地走进大海",
    status: "待确认",
    items: [
      ["上午", "打车前往山海关", "从北戴河酒店出发，单程暂按约 1 小时"],
      ["上午", "老龙头", "看长城入海、澄海楼与海岸构图"],
      ["中午", "古城午餐与长休息", "浑锅、桲椤叶饼或四条包子"],
      ["下午", "天下第一关 + 山海关古城", "结束后打车返回北戴河"],
    ],
  },
  {
    date: "09.02",
    weekday: "周三",
    city: "北戴河 → 承德",
    title: "上午看海，下午转场",
    status: "暂定",
    items: [
      ["07:30", "老虎石或中海滩路", "沙滩拍照与沿海散步二选一"],
      ["14:13", "北戴河站出发", "动车车次编号待补"],
      ["18:16", "抵达承德南站", "前往暂定的亚朵避暑山庄酒店"],
    ],
  },
  {
    date: "09.03",
    weekday: "周四",
    city: "承德",
    title: "双寺与承德博物馆",
    status: "待预约",
    items: [
      ["08:00", "普陀宗乘之庙（小布达拉宫）", "红台、白台、五塔门与山势关系"],
      ["10:00+", "普宁寺", "争取在 12:00—12:30 前结束"],
      ["中午", "午餐与长休息", "预留约 1.5—2 小时"],
      ["14:30", "承德博物馆", "免费，须通过官方微信公众号实名预约"],
    ],
    note: "这天有三处地点，节奏偏满；若上午延误，优先缩短博物馆停留，不压缩午休。",
  },
  {
    date: "09.04",
    weekday: "周五",
    city: "承德",
    title: "避暑山庄第一段",
    status: "待确认",
    items: [
      ["上午", "转住绮望楼宾馆", "从亚朵退房，先寄存行李"],
      ["白天", "避暑山庄", "优先宫殿区和湖区，中午安排长休息"],
      ["晚上", "入住绮望楼宾馆", "暂定 1100 元/晚，房型与权益待确认"],
    ],
  },
  {
    date: "09.05",
    weekday: "周六",
    city: "承德 → 北京 → 厦门",
    title: "上午游园，下午返程",
    status: "暂定",
    items: [
      ["早餐后", "避暑山庄第二段", "只补前一天未完成且靠近出口的区域"],
      ["15:29", "承德南站出发", "暂定 G164 次"],
      ["16:18", "抵达北京朝阳站", "直接前往北京首都机场 T3"],
      ["20:20", "国航 CA1801 起飞", "23:10 抵达厦门高崎 T4，暂见 690 元"],
    ],
  },
];

const tickets = [
  ["已确认 · 航班", "SC2123", "09:30", "12:25", "厦门高崎 T4", "北京首都 T3", "8 月 30 日"],
  ["暂定 · 动车", "C115", "11:22", "13:40", "北京站", "北戴河站", "8 月 31 日"],
  ["暂定 · 动车", "车次待补", "14:13", "18:16", "北戴河站", "承德南站", "9 月 2 日"],
  ["暂定 · 高铁", "G164", "15:29", "16:18", "承德南站", "北京朝阳站", "9 月 5 日"],
  ["暂定 · 航班", "CA1801", "20:20", "23:10", "北京首都 T3", "厦门高崎 T4", "9 月 5 日 · 690 元"],
];

export default function TripPage() {
  return (
    <main className="trip-page">
      <header className="trip-nav">
        <a href="#top" className="trip-brand"><span>北</span>山海入承</a>
        <nav><a href="#route">路线</a><a href="#days">每日行程</a><a href="#stays">住宿</a></nav>
      </header>

      <section className="trip-hero" id="top">
        <div>
          <p className="trip-eyebrow">2026 夏末旅行计划 · 可修改草案</p>
          <h1>从海上长城，<br /><em>走进皇家园林。</em></h1>
          <p className="trip-lead">北京休整，北戴河看海，山海关触摸长城，最后在承德慢慢读懂一座皇家山水城。</p>
          <div className="trip-stats"><span><b>8.30—9.5</b><small>7 天 6 晚</small></span><span><b>3—5 人</b><small>同行人数</small></span><span><b>公共交通</b><small>主要方式</small></span><span><b>慢节奏</b><small>保留午休</small></span></div>
        </div>
        <div className="trip-art" aria-label="山海长城到皇家园林"><i /><b>山海长城</b><span>→</span><b>皇家园林</b></div>
      </section>

      <section className="trip-section trip-route" id="route">
        <div className="trip-heading"><p>01</p><h2>一眼看懂全程</h2><span>北戴河连续住两晚，山海关当天打车往返；承德最后换住绮望楼，衔接两段避暑山庄。</span></div>
        <div className="trip-route-line">
          {[['北京','8.30—8.31'],['北戴河','8.31—9.2'],['山海关','9.1 往返'],['承德','9.2—9.5']].map(([name,date],i)=><div key={name}><i>{i+1}</i><b>{name}</b><small>{date}</small></div>)}
        </div>
      </section>

      <section className="trip-tickets" aria-label="交通信息">
        {tickets.map(([type,code,start,end,from,to,date]) => <article key={`${date}-${code}`}><p><span>{type}</span><b>{code}</b></p><div><strong>{start}</strong><i /><strong>{end}</strong></div><p><span>{from}</span><span>{to}</span></p><small>{date}</small></article>)}
      </section>

      <section className="trip-days" id="days">
        <div className="trip-section trip-heading"><p>02</p><h2>每日行程</h2><span>点击日期可以收起或展开。未购票与未预约内容均保留“暂定”状态。</span></div>
        <div className="trip-day-list">
          {days.map((day) => <details key={day.date} open>
            <summary><time>{day.date}<small>{day.weekday}</small></time><div><span>{day.city}</span><h3>{day.title}</h3></div><em>{day.status}</em><i>＋</i></summary>
            <div className="trip-timeline">
              {day.items.map(([time,title,detail]) => <div key={`${time}-${title}`}><time>{time}</time><i /><p><b>{title}</b><span>{detail}</span></p></div>)}
              {day.note && <aside>{day.note}</aside>}
            </div>
          </details>)}
        </div>
      </section>

      <section className="trip-section trip-booking">
        <div className="trip-heading"><p>03</p><h2>预约与提醒</h2><span>这些事项会直接影响能否按计划进入景区或衔接下一程。</span></div>
        <div>
          <article><small>承德博物馆</small><h3>需要提前实名预约</h3><p>免费参观，通过“承德博物馆”官方微信公众号预约。周二至周日 09:00—17:00，16:00停止入馆；建议预约9月3日约14:30的下午场。</p><a href="https://www.chdmuseum.cn/a/about/jtxw/473.html" target="_blank" rel="noreferrer">查看官方说明 ↗</a></article>
          <article><small>返程衔接</small><h3>高铁与航班相隔 4 小时 02 分</h3><p>G164 暂定16:18抵达北京朝阳站，CA1801 暂定20:20从首都机场T3起飞。抵京后不安排其他活动，直接前往机场。</p></article>
          <article><small>下一步</small><h3>仍需补齐三项</h3><p>9月2日动车车次编号；9月5日高铁与航班出票；最终同行人数。所有票务以订单为准。</p></article>
        </div>
      </section>

      <section className="trip-stays" id="stays">
        <div className="trip-section trip-heading"><p>04</p><h2>住宿安排</h2><span>价格均为当前记录，暂定酒店在预订前仍需核对房型、早餐、税费和取消政策。</span></div>
        <div className="trip-section trip-stay-grid">
          <article><small>北京 · 已确认</small><h3>北航唯实酒店</h3><p>8月30日入住，次日携行李前往北京站。</p></article>
          <article><small>北戴河 · 2晚 · 暂定</small><h3>北戴河喜来登酒店</h3><p>去哪儿旅行暂见 <b>499元/晚</b>。</p></article>
          <article><small>承德 · 2晚 · 暂定</small><h3>亚朵避暑山庄酒店</h3><p>9月2—3日，亲子房暂看 <b>600+元/晚</b>。</p></article>
          <article><small>承德 · 1晚 · 暂定</small><h3>绮望楼宾馆</h3><p>9月4日入住，预计 <b>1100元/晚</b>。</p></article>
        </div>
      </section>

      <footer className="trip-footer"><div><span>北</span><p><b>北京—北戴河—山海关—承德</b><small>最后更新：2026年8月18日</small></p></div><p>未购票车次、房价及景区开放，以临近出发时的官方信息为准。</p></footer>
    </main>
  );
}
