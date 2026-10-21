import type { ReactNode } from "react";
import { SiteNav } from "../components/SiteNav";
import styles from "./quadruped-inspection.module.css";

const chapters = [
  ["task", "01", "巡检任务"], ["system", "02", "系统组成"],
  ["hardware", "03", "硬件搭建"], ["navigation", "04", "定位与巡航"],
  ["validation", "05", "验证记录"], ["research", "06", "前期积累"],
  ["next", "07", "下一步"],
] as const;

function Chapter({ number, label, title, children }: { number: string; label: string; title: ReactNode; children?: ReactNode }) {
  return <header className={styles.chapterHeading}>
    <span className={styles.chapterNumber}>{number}</span>
    <div><p className={styles.eyebrow}>{label}</p><h2>{title}</h2>{children}</div>
  </header>;
}

function FigureCaption({ number, children }: { number: string; children: ReactNode }) {
  return <figcaption className={styles.caption}><span>FIG. {number}</span><p>{children}</p></figcaption>;
}

function RobotDrawing() {
  return <svg viewBox="0 0 640 500" role="img" aria-labelledby="robot-drawing-title robot-drawing-desc" className={styles.robotDrawing}>
    <title id="robot-drawing-title">四足机器人与机载模块结构示意</title>
    <desc id="robot-drawing-desc">四足载体上方布置感知与计算模块，编号分别对应感知、机载计算、供电连接和移动载体。图为抽象结构示意，不代表实际设备型号或安装位置。</desc>
    <defs>
      <pattern id="robot-grid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.14" /></pattern>
      <pattern id="robot-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(32)"><path d="M0 0V6" stroke="currentColor" strokeWidth="1" opacity="0.25" /></pattern>
    </defs>
    <path fill="url(#robot-grid)" d="M28 30H612V456H28z" />
    <g fill="none" stroke="currentColor" strokeWidth="1" opacity="0.25">
      <ellipse cx="328" cy="402" rx="232" ry="34" />
      <path d="M48 403H592M320 60V445" strokeDasharray="5 7" />
      <path d="M43 47h16m-8-8v16M581 47h16m-8-8v16M43 439h16m-8-8v16M581 439h16m-8-8v16" />
    </g>
    <g fill="var(--paper-deep)" stroke="currentColor" strokeWidth="2" opacity="0.6" strokeLinejoin="round">
      <path d="M267 256l45 57-32 76h-23l23-69-48-51z" />
      <path d="M437 244l36 61-30 77h-24l23-73-39-55z" />
      <path d="M254 386h29l10 8h-45zM415 380h32l8 9h-47z" />
    </g>
    <g stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
      <path d="M167 216l66-41 254 13 31 33-54 65-258-12-39-31z" fill="var(--paper)" />
      <path d="M167 216l270 16 81-11-54 65-258-12-39-31z" fill="url(#robot-hatch)" />
      <path d="M167 216l270 16 27 54M437 232l50-44" fill="none" />
      <path d="M190 214l49-25 172 9-33 26z" fill="var(--paper-deep)" />
      <path d="M256 179v-38l114 5v40z" fill="var(--paper)" />
      <path d="M256 141l25-14 113 5-24 14M370 146l24-14v40l-24 14" fill="var(--paper-deep)" />
      <path d="M266 153l83 4m-83 7 83 4" fill="none" opacity="0.6" />
      <path d="M204 193v-30l33-18 30 8v24l-35 22z" fill="var(--paper)" />
      <ellipse cx="235" cy="146" rx="28" ry="10" fill="var(--paper-deep)" />
      <path d="M207 146v16c0 12 56 12 56 0v-16" fill="var(--paper)" />
      <ellipse cx="235" cy="146" rx="28" ry="10" fill="var(--paper)" />
      <path d="M235 127v10M418 192v-59m-8 0h20" fill="none" />
      <path d="M462 218l28-19 21 17-25 25z" fill="var(--paper-deep)" />
      <path d="M213 255l53 64-53 85h-25l43-84-43-46z" fill="var(--paper)" />
      <path d="M418 266l28 65-25 85h-24l18-83-31-60z" fill="var(--paper)" />
      <path d="M188 402h29l12 11h-51zM394 413h31l13 11h-50z" fill="var(--paper-deep)" />
      <circle cx="210" cy="261" r="20" fill="var(--paper-deep)" /><circle cx="210" cy="261" r="9" fill="var(--paper)" />
      <circle cx="405" cy="271" r="20" fill="var(--paper-deep)" /><circle cx="405" cy="271" r="9" fill="var(--paper)" />
      <circle cx="249" cy="321" r="9" fill="var(--paper-deep)" /><circle cx="430" cy="333" r="9" fill="var(--paper-deep)" />
      <path d="M288 242l69 4m-69 8 69 4" opacity="0.55" />
    </g>
    <g fill="none" stroke="var(--rust)" strokeWidth="1.5"><path d="M235 123V82H134M326 126V64h161M377 240l150 43h31M252 347l-125-17H89" /><circle cx="235" cy="123" r="3" /><circle cx="326" cy="126" r="3" /><circle cx="377" cy="240" r="3" /><circle cx="252" cy="347" r="3" /></g>
    <g fontFamily="Menlo, monospace" fontSize="14" fill="var(--ink)"><text x="97" y="86">01</text><text x="496" y="68">02</text><text x="567" y="288">03</text><text x="54" y="335">04</text></g>
    <g fontFamily="Menlo, monospace" fontSize="10" fill="currentColor" opacity="0.7"><text x="41" y="477">SCHEMATIC / NOT TO SCALE</text><text x="474" y="477">SIDE STUDY — 01</text></g>
  </svg>;
}

function RouteDrawing() {
  return <svg viewBox="0 0 660 310" role="img" aria-labelledby="route-drawing-title route-drawing-desc" className={styles.routeDrawing}>
    <title id="route-drawing-title">固定点位与临时障碍的巡检路线示意</title>
    <desc id="route-drawing-desc">一条路线连接三个虚构观察点，中段用虚线示意绕开障碍的候选路线。这不是实测轨迹。</desc>
    <g fill="var(--paper-deep)" stroke="currentColor" strokeWidth="1"><path d="M35 35h170v58H35zM254 35h145v58H254zM448 35h175v58H448zM35 225h170v50H35zM254 225h145v50H254zM448 225h175v50H448z" /></g>
    <g fill="currentColor" fontSize="13" fontFamily="Menlo, monospace"><text x="86" y="70">ZONE A</text><text x="298" y="70">ZONE B</text><text x="500" y="70">ZONE C</text></g>
    <path d="M66 160H592" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.25" />
    <path d="M67 160h200l42-49h75l46 49h163" fill="none" stroke="var(--green)" strokeWidth="3" strokeDasharray="7 6" />
    <path d="M324 140h43v42h-43z" fill="var(--rust)" opacity="0.8" />
    <g fill="var(--paper)" stroke="var(--green)" strokeWidth="2"><circle cx="90" cy="160" r="9" /><circle cx="242" cy="160" r="9" /><circle cx="560" cy="160" r="9" /></g>
    <g fill="currentColor" fontFamily="Menlo, monospace" fontSize="12"><text x="73" y="198">P.01</text><text x="224" y="198">P.02</text><text x="542" y="198">P.03</text></g>
    <path d="M583 154l12 6-12 6" fill="none" stroke="var(--green)" strokeWidth="2" />
  </svg>;
}

export function QuadrupedInspectionProjectPage({ projectIndex, projectCount }: { projectIndex: number; projectCount: number }) {
  return <main className={`portfolio ${styles.page}`}>
    <div className="paper-frame" aria-hidden="true" /><div className="film-strip" aria-hidden="true" />
    <a className={styles.skipLink} href="#inspection-content">跳到项目正文</a>
    <header className="masthead" id="inspection-top">
      <a className="wordmark" href="/" aria-label="reflex4 首页">reflex<span>4</span></a>
      <SiteNav active="projects" activeProject="quadruped-inspection" />
      <div className="edition"><span>Engineering Fieldnotes</span><span>File {String(projectIndex + 1).padStart(2, "0")} / {String(projectCount).padStart(2, "0")}</span></div>
    </header>

    <article className={styles.story} id="inspection-content" aria-labelledby="inspection-title">
      <section className={styles.hero} aria-labelledby="inspection-title">
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>00 / QUADRUPED INSPECTION</p>
          <p className={styles.heroOverline}>工程档案 · 多源感知与硬件搭建</p>
          <h1 id="inspection-title">面向自主巡检的<br /><span>四足机器人</span></h1>
          <p className={styles.heroIntro}>从一套硬件平台，<br />走向可复核的巡检记录。</p>
          <p className={styles.heroDescription}>以四足机器人为载体，连接多源感知、定位导航与巡检任务。我在团队中负责硬件搭建，这里记录平台的组成，以及它为后续联调提供的基础。</p>
          <nav className={styles.actions} aria-label="项目重点内容"><a href="#hardware">查看硬件搭建 <span>↘</span></a><a href="#validation">查看验证记录 <span>↓</span></a></nav>
        </div>
        <figure className={styles.heroFigure}>
          <div className={styles.figureTop}><span>PLATFORM STUDY</span><span>结构示意</span></div>
          <RobotDrawing />
          <div className={styles.figureLegend}><span><b>01</b> 感知</span><span><b>02</b> 计算</span><span><b>03</b> 供电与连接</span><span><b>04</b> 载体</span></div>
          <FigureCaption number="01">模块关系示意，非设备实拍；不表示实际型号、安装位置或尺寸。</FigureCaption>
        </figure>
      </section>
      <dl className={styles.facts}>
        <div><dt>CONTRIBUTION / 个人工作</dt><dd>reflex4 · 硬件搭建</dd></div>
        <div><dt>FOCUS / 应用方向</dt><dd>多源感知与自主巡检</dd></div>
        <div><dt>STAGE / 工程状态</dt><dd>硬件与导航基础已形成<span>完整任务链路仍需联调验证</span></dd></div>
      </dl>
      <nav className={styles.contents} aria-label="本页章节">
        {chapters.map(([id, number, title]) => <a key={id} href={`#${id}`}><span>{number}</span>{title}</a>)}
      </nav>

      <section className={styles.section} id="task">
        <Chapter number="01" label="THE TASK" title={<>走完一条路，<br />也留下可复核的记录。</>}>
          <p>巡检关注的不只是机器狗能否行走，还包括能否到达同一个观察位置，把采集结果与点位关联，让下一次检查有据可循。</p>
        </Chapter>
        <div className={styles.threeColumns}>
          <div><span className={styles.smallIndex}>A / ARRIVE</span><h3>到达位置</h3><p>从室外道路进入建筑通道，卫星可见性、光照与几何特征都会改变，定位需要适应这些变化。</p></div>
          <div><span className={styles.smallIndex}>B / OBSERVE</span><h3>采到可用信息</h3><p>图像、点云、时间与位姿需要能够关联，才能说明观察到了什么，以及它发生在哪里。</p></div>
          <div><span className={styles.smallIndex}>C / REVIEW</span><h3>交给人复核</h3><p>记录对应任务与设备点位，疑似异常保留观察依据，由人员确认状态与后续处理。</p></div>
        </div>
        <p className={styles.marginNote}>以上为巡检任务目标，完整采集与复核流程仍需通过实际任务验证。</p>
      </section>

      <section className={styles.section} id="system">
        <Chapter number="02" label="SYSTEM AT A GLANCE" title={<>把感知、计算和运动，<br />放进同一套系统。</>} />
        <div className={styles.architecture}>
          <div className={styles.architectureLead}><p>硬件提供观测与运动基础，机载软件处理数据，任务层组织巡检与记录。各层分别联调，完成程度也分别记录。</p><span className={styles.architectureLabel}>功能关系示意<br />从现场观测到任务记录 ↓</span></div>
          <ol className={styles.layers}>
            {[
              ["01", "移动与采集", "四足载体 · 激光 · 视觉 · 惯性 · 卫星定位", "硬件基础"],
              ["02", "接入与机载计算", "同步与供电 · 数据接入 · 时间与坐标处理", "持续联调"],
              ["03", "定位与导航", "位姿与地图 · 路径规划 · 局部控制 · 状态监控", "代码基础"],
              ["04", "巡检任务与记录", "点位任务 · 观察记录 · 异常提示 · 人工复核", "设计与验证"],
            ].map(([number, title, detail, status]) => <li key={number}><b>{number}</b><div><h3>{title}</h3><p>{detail}</p></div><span className={styles.status}>{status}</span></li>)}
          </ol>
        </div>
      </section>

      <section className={`${styles.section} ${styles.hardware}`} id="hardware">
        <Chapter number="03" label="MY PART / HARDWARE" title={<>我的工作，<br />从硬件搭建开始。</>} />
        <div className={styles.hardwareIntro}><p>我在团队中负责硬件搭建。机器狗承载的不只是传感器，还有计算、供电与连接这些让系统运行起来的基础部分。</p><p>下面按功能拆开平台，说明各部分的作用。定位、识别、导航与管理平台作为团队系统介绍，个人工作范围为硬件搭建。</p></div>
        <figure className={styles.hardwareFigure}>
          <div className={styles.figureTop}><span>HARDWARE / FUNCTIONAL ASSEMBLY</span><span>功能分组 · 非接线图</span></div>
          <div className={styles.assembly}>
            <div><span>INPUT</span><h3>多源感知</h3><p>激光 / 视觉<br />惯性 / 卫星观测</p></div><b aria-hidden="true">→</b>
            <div><span>ONBOARD</span><h3>机载处理</h3><p>数据接入 / 同步<br />计算 / 运行监测</p></div><b aria-hidden="true">→</b>
            <div><span>PLATFORM</span><h3>运动载体</h3><p>承载 / 运动执行<br />供电与物理连接</p></div>
          </div>
          <FigureCaption number="02">各部件承担的功能。连接关系为简化说明，不包含具体接线、接口参数或内部电路。</FigureCaption>
        </figure>
        <div className={styles.hardwareNotes}>
          <article><span className={styles.smallIndex}>01 / SENSING</span><h3>传感器与载体</h3><p>激光提供环境几何，视觉提供图像信息，惯性描述短时运动，卫星观测提供有效覆盖区内的位置参考。不同输入各有可用条件。</p></article>
          <article><span className={styles.smallIndex}>02 / CONNECTION</span><h3>计算、供电与连接</h3><p>机载计算单元承接采集与运算，同步模块关联数据时间，供电和物理连接让各模块组成实验平台。</p></article>
          <article><span className={styles.smallIndex}>03 / INTEGRATION</span><h3>从搭建走向联调</h3><p>设备接入、采样时间、外参和坐标关系需要逐项核对。硬件组装完成之后，还要检查数据是否能被后续模块正确使用。</p></article>
        </div>
        <aside className={styles.editorNote}><span>工程注记</span><p>装上设备、有数据输出、完成标定、参与融合，是不同的完成状态。搭建为联调提供基础，每一步还需要自己的验证记录。</p></aside>
      </section>

      <section className={styles.section} id="navigation">
        <Chapter number="04" label="FROM INPUT TO ACTION" title={<>硬件的输入，<br />怎样变成一次巡检？</>} />
        <div className={styles.navigationLayout}>
          <div className={styles.explanations}>
            <article><span>01</span><div><h3>先确定自己在哪里</h3><p>局部观测用于估计运动与构建地图，卫星观测在有效条件下提供全局参考。融合之前，时间与坐标必须能够对应。</p></div></article>
            <article><span>02</span><div><h3>再决定怎样到达</h3><p>规划给出目标点之间的路线，局部控制根据障碍更新运动指令。已有工程基础包含点云处理、规划控制与状态监控。</p></div></article>
            <article><span>03</span><div><h3>让观察有据可查</h3><p>巡检设计将采集结果与点位、位姿和任务关联，保留疑似异常的观察依据。完整记录与人工复核仍在完善范围内。</p></div></article>
          </div>
          <figure className={styles.routeFigure}>
            <div className={styles.figureTop}><span>ROUTE STUDY</span><span>规划示意</span></div>
            <RouteDrawing />
            <div className={styles.routeLegend}><span><i />绕行候选</span><span><i />临时障碍</span><span>○ 观察点位</span></div>
            <div className={styles.routeNote}><strong>没有可确认的路径时，怎么办？</strong><p>设计上需要暂停运动并交给人员处理。故障检出、指令响应与实机停止，应分别通过整机测试核对。</p></div>
            <FigureCaption number="03">虚构布局与候选路线，仅解释规划关系，不是实测轨迹或已完成的绕障演示。</FigureCaption>
          </figure>
        </div>
      </section>

      <section className={styles.section} id="validation">
        <Chapter number="05" label="EVIDENCE & SCOPE" title={<>不同层的完成，<br />用不同的证据说明。</>}>
          <p>项目已形成硬件与导航工程基础。单模块运行、代码测试和完整巡检任务，是三个不同的验证范围。</p>
        </Chapter>
        <div className={styles.validationTable} role="table" aria-label="工程基础与验证范围">
          <div role="row" className={styles.validationHead}><span role="columnheader">验证层级</span><span role="columnheader">目前的基础</span><span role="columnheader">还需要核对</span></div>
          {[
            ["01", "硬件平台", "已有搭建基础", "感知、计算、供电与移动载体组成实验平台。", "逐项核对采集接入、时间关系与标定记录。"],
            ["02", "定位与建图", "已有研究实验", "前期进行了弱纹理跟踪、短路线定位与建图实验。", "实验版本、真值与误差定义；不能直接代表当前整机性能。"],
            ["03", "导航与监控", "已有代码基础", "已形成规划、局部控制、点云处理与本地测试记录。", "代码测试之外，还需核对实际运行与整机行为。"],
            ["04", "整机任务", "待完整验证", "围绕路线到达、障碍处理与任务恢复组织验证。", "记录实机运行条件、故障处理和实际停止情况。"],
            ["05", "记录与复核", "设计与完善中", "将观察结果关联到点位、任务与人工复核流程。", "以真实巡检任务检验数据完整性与流程可用性。"],
          ].map(([number, title, state, existing, remaining]) => <div role="row" className={styles.validationRow} key={number}><div role="rowheader"><span>{number}</span><h3>{title}</h3><b className={styles.status}>{state}</b></div><p role="cell">{existing}</p><p role="cell"><span className={styles.mobileCellLabel}>还需要核对</span>{remaining}</p></div>)}
        </div>
        <p className={styles.marginNote}>本页概述工程状态，不将试点目标写为已实现成绩；短路线实验也不能代表长期稳定性。</p>
      </section>

      <section className={`${styles.section} ${styles.research}`} id="research">
        <Chapter number="06" label="EARLIER RESEARCH" title={<>从救援感知，<br />延伸到巡检任务。</>} />
        <div className={styles.researchBody}><p>前期研究围绕地面机器人的定位与救援感知展开，涉及弱纹理下的跟踪、多源定位与人体目标的空间关联。它留下了三个持续需要回答的问题：观测不稳定时怎样定位，检测结果怎样关联位置，以及结果怎样回到具体实验条件中解释。</p><p>巡检方向将这些问题延伸到固定路线、设备点位与可复核的任务记录。早期人体检测与建图属于研究积累，不用于证明当前设备异常识别或完整巡检能力。</p><a href="/blog/how-a-machine-locates-itself/">相关阅读：一台机器如何理解自己站在哪里 <span>↗</span></a></div>
      </section>

      <section className={styles.section} id="next">
        <Chapter number="07" label="WHAT COMES NEXT" title={<>从平台基础，<br />走向完整验证。</>} />
        <ol className={styles.nextList}><li><span>01</span><div><h3>补齐平台联调</h3><p>核对实际配置、时间与坐标关系，让接入、标定和融合有可追溯的记录。</p></div></li><li><span>02</span><div><h3>验证真实运行</h3><p>在明确可通行区域检查路线、障碍处理与任务恢复，分别记录软件响应和实际停车。</p></div></li><li><span>03</span><div><h3>连接观察与复核</h3><p>用真实任务检查点位、采集记录与人工复核的关联，验证信息是否完整一致。</p></div></li></ol>
        <p className={styles.closing}>一步步搭起来，<br /><em>也一步步验证。</em></p>
      </section>
    </article>
    <footer className={styles.footer}><div><span>REFLEX4 / ENGINEERING ARCHIVE</span><p>四足机器人 · 硬件搭建记录</p></div><nav aria-label="项目页底部导航"><a href="/#research">返回首页项目区 ↗</a><a href="#inspection-top">回到顶部 ↑</a></nav></footer>
  </main>;
}
