import React, { useState, useMemo } from "react";
import {
  DollarSign, Bot, Calendar, ChevronDown, ChevronRight,
  AlertTriangle, XCircle, Activity, Lock, ExternalLink, Zap, Ban,
} from "lucide-react";

/**
 * 사회복지사 2급 교육원 비교 v3 — ch2 마무리
 * 뉴브루탈리즘 + 베이지 크림톤. 4곳 F12 실측 완료 + 2곳 패스.
 * v2 대비: 해커스 실측 반영(진도저장 평문 발견!) + Kstudy/유비온 패스 확정.
 */

const B = {
  ink: "#1c1917", cream: "#fdfcf7", card: "#fffdf8", sub: "#78716c",
  shadow: "4px 4px 0 0 #1c1917", shadowSm: "2px 2px 0 0 #1c1917",
};
const ST = {
  best:    { label: "최적",   c: "#047857", bg: "#d1fae5", dot: "#059669" },
  ok:      { label: "가능",   c: "#1d4ed8", bg: "#dbeafe", dot: "#2563eb" },
  limited: { label: "부분",   c: "#b45309", bg: "#fef3c7", dot: "#d97706" },
  risk:    { label: "주의",   c: "#be123c", bg: "#ffe4e6", dot: "#e11d48" },
  no:      { label: "불가",   c: "#be123c", bg: "#ffe4e6", dot: "#e11d48" },
  unknown: { label: "미확인", c: "#57534e", bg: "#e7e5e4", dot: "#a8a29e" },
};

// ── 교육원 데이터 (ch2 최종) ────────────────────────────────
const SITES = [
  {
    id: "joongang", name: "중앙사이버", url: "joongangcyber.com", tag: "🥇 실결제 최저",
    priceLabel: "72만", priceNum: 720000, perSubject: "정가 15만→70% 할인",
    credit: "ok", lms: "ok", lmsLabel: "iframe→HTML5",
    listeners: 6, ratechange: false, autoVerdict: "limited", passed: false, tested: true,
    progressPayload: "맛보기 부모 끊김 → 미확인 (정식 강의실 확인 필요)",
    login: "SecuKit NXS 공동인증서 (ID/PW 일반로그인 옵션 있음 — 수강 가능 시 우회)",
    memo: "iframe(media.joongangcyber.com) → 내부는 순수 HTML5 video. 배속 2.0 실측 성공. ratechange 감지 없음 ✅. 관문은 SecuKit 로그인 — ID/PW로 수강까지 되면 자동화 가능성 ↑. 17과목 이론 패키지 240만→70%할인→72만.",
    highlight: null,
  },
  {
    id: "mega", name: "메가원격", url: "caedu.co.kr", tag: "🏆 영상제어 최청정",
    priceLabel: "86.7만*", priceNum: 867000, perSubject: "이론당 3.54만",
    credit: "ok", lms: "best", lmsLabel: "HTML5 직접",
    listeners: 0, ratechange: false, autoVerdict: "limited", passed: false, tested: true,
    progressPayload: "맛보기 부모 끊김 → 미확인 (정식 강의실 확인 필요)",
    login: "IP출석 1인 + 생체/OTP/PIN/SMS/PKI 대리출석 차단",
    memo: "★여름초특가(6/24마감): 풀패키지 86.7만(77%할인). getEventListeners(video)가 완전히 {}(리스너 0개) — 배속·건너뛰기·탭이탈 전부 감지 안 함, 5곳 최청정. 단 핵심 관문은 IP·생체/OTP 출석 장벽. 진도저장 구조는 정식 강의실에서만 확인 가능.",
    highlight: "⭐ 영상제어 0개 — 업계 최청정",
  },
  {
    id: "baeoom", name: "배움사이버", url: "career.baeoom.com", tag: "✅ 가입완료",
    priceLabel: "88.24만", priceNum: 882400, perSubject: "공개 고정가 4.5만",
    credit: "ok", lms: "best", lmsLabel: "HTML5 직접",
    listeners: 17, ratechange: true, autoVerdict: "limited", passed: false, tested: true,
    progressPayload: "맛보기 소스 404(영상 재생 불가) → 실측 자체 불가. 정식 강의 필수.",
    login: "SMS 본인인증 or 공동인증서 필수 (ID/PW만으론 수강불가). 수강PC 3대 등록.",
    memo: "순수 HTML5(iframe 없음). 단 맛보기 소스가 404 → 영상 재생 자체 안 됨. ratechange 등 리스너 17개 있으나 실제 배속 막는지 미확인(UI 동기화용일 수도). 정식 강의 재생해야 최종 판정. LMS ID: silvercare / Gmail: silvercare.admin@gmail.com.",
    highlight: null,
  },
  {
    id: "hackers", name: "해커스", url: "paranhanul.net", tag: "💎 진도저장 평문 발견",
    priceLabel: "9,700원*", priceNum: 9700, perSubject: "조건부 이벤트(7과목↑)",
    credit: "ok", lms: "best", lmsLabel: "HTML5 직접",
    listeners: 20, ratechange: true, autoVerdict: "limited", passed: false, tested: true,
    progressPayload: "lecture.Videotime.ajax.php — video_time=132.885496 (float 평문, 암호화 없음) ✅",
    login: "class.paranhanul.net 수강생 전용 강의실",
    memo: "HTML5 직접(CDN: hanul-mp4.hackers...). 배속 2.0 맛보기 성공. 감지 리스너 ~20개(ratechange+seeking 포함) — 4곳 중 가장 많음. ★단 진도저장 Payload가 완전 평문: video_time=132.885496 float POST (암호화·서명 없음). 출석=누적 학습시간(우측 상단 0분 달성 시 인정). 9,700원은 7과목↑ 이벤트 조건부 — 정가/취소조건 별도 확인 필수.",
    highlight: "💎 진도저장 Payload 완전 평문 — ch4 자동화 셋업 핵심 실마리",
  },
  {
    id: "kstudy", name: "Kstudy", url: "kstudy.co.kr", tag: "🚫 이번 선정 제외",
    priceLabel: "6.9만", priceNum: 69000, perSubject: "패키지 고정가",
    credit: "ok", lms: "unknown", lmsLabel: "미측정",
    listeners: null, ratechange: null, autoVerdict: "unknown", passed: true, tested: false,
    progressPayload: "—",
    login: "—",
    memo: "맛보기 영상 미제공 → F12 실측 불가. 사이트 속도 느림, UI/UX 타사 대비 불편. 이번 기관 선정에서 제외. (22년 운영, 출석률 80%+시험 60분 1회는 계속 유효 — 향후 재검토 여지 있음.)",
    highlight: null,
  },
  {
    id: "ubion", name: "유비온", url: "iubion.com", tag: "🚫 이론 과목 없음",
    priceLabel: "—", priceNum: 9999999, perSubject: "—",
    credit: "unknown", lms: "unknown", lmsLabel: "미측정",
    listeners: null, ratechange: null, autoVerdict: "no", passed: true, tested: false,
    progressPayload: "—",
    login: "—",
    memo: "이론 과목 0개 (2026년 6기수 전체 조회). 실습 1과목만 9월 3일(4회차) 신청 가능. 자격증 취득 목적으로 사용 불가 → 탈락.",
    highlight: null,
  },
];

// ── 작은 컴포넌트 ────────────────────────────────────────────
function Chip({ status, text }) {
  const s = ST[status] || ST.unknown;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 800,
      color: s.c, background: s.bg, border: `1.5px solid ${B.ink}`, borderRadius: 999,
      padding: "3px 10px", whiteSpace: "nowrap",
    }}>
      <span style={{ width: 8, height: 8, borderRadius: 999, background: s.dot }} />
      {text || s.label}
    </span>
  );
}

function SectionTitle({ no, title, sub }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 12, marginBottom: 16 }}>
      <span style={{
        fontFamily: "ui-monospace, Menlo, monospace", fontSize: 30, fontWeight: 900,
        color: B.ink, lineHeight: 1, letterSpacing: -1,
      }}>{no}</span>
      <div>
        <div style={{ fontSize: 20, fontWeight: 900, color: B.ink, lineHeight: 1.1 }}>{title}</div>
        {sub && <div style={{ fontSize: 13, color: B.sub, fontWeight: 600, marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
}

function Card({ children, style }) {
  return (
    <div style={{
      background: B.card, border: `2px solid ${B.ink}`, borderRadius: 14,
      boxShadow: B.shadow, padding: 18, ...style,
    }}>{children}</div>
  );
}

function CleanlinessBar({ listeners }) {
  if (listeners === null) return <span style={{ fontSize: 12, color: B.sub, fontWeight: 700 }}>미측정</span>;
  const pct = Math.max(6, 100 - Math.min(listeners, 20) / 20 * 100);
  const color = listeners === 0 ? "#6ee7b7" : listeners < 10 ? "#93c5fd" : "#fcd9a8";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 16, background: "#efe9da", border: `1.5px solid ${B.ink}`, borderRadius: 999, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRight: `1.5px solid ${B.ink}` }} />
      </div>
      <span style={{ fontSize: 12.5, fontWeight: 900, color: B.ink, minWidth: 60, textAlign: "right" }}>
        {listeners === 0 ? "0개 🏆" : `${listeners}개`}
      </span>
    </div>
  );
}

// ── 메인 ─────────────────────────────────────────────────────
export default function SocialWorkerAcademyCompareV3() {
  const [open, setOpen] = useState("joongang");

  const tested = useMemo(() => SITES.filter((s) => s.tested), []);
  const priceRank = useMemo(
    () => SITES.filter((s) => s.priceNum < 900000 && s.id !== "hackers" && !s.passed)
      .sort((a, b) => a.priceNum - b.priceNum),
    []
  );

  const font = { fontFamily: "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif" };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #fdfcf7 0%, #f5f1e8 45%, #ebe4d3 100%)",
      padding: "28px 16px 56px", ...font,
    }}>
      <div style={{ maxWidth: 880, margin: "0 auto" }}>

        {/* ── 헤더 ── */}
        <div style={{ marginBottom: 22 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
            <span style={{
              display: "inline-block", fontSize: 12, fontWeight: 800, color: B.ink,
              background: "#fde68a", border: `2px solid ${B.ink}`, borderRadius: 999,
              padding: "4px 12px", boxShadow: B.shadowSm,
            }}>🎓 사회복지사 2급 · S1 ch2 마무리</span>
            <span style={{
              display: "inline-block", fontSize: 12, fontWeight: 800, color: "#047857",
              background: "#d1fae5", border: `2px solid ${B.ink}`, borderRadius: 999,
              padding: "4px 12px", boxShadow: B.shadowSm,
            }}>✅ 4곳 실측 완료 · 2곳 패스</span>
          </div>
          <h1 style={{ fontSize: 34, fontWeight: 900, color: B.ink, margin: "0 0 4px", lineHeight: 1.05 }}>
            F12로 직접 찍은 자동화 비교
          </h1>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: B.sub, margin: 0, lineHeight: 1.1 }}>
            가설 아님 · 실데이터 · ch2 최종
          </h2>
        </div>

        {/* ── 한 줄 결론 ── */}
        <div style={{
          background: B.ink, color: "#fdfcf7", border: `2px solid ${B.ink}`, borderRadius: 14,
          boxShadow: B.shadow, padding: 18, marginBottom: 26,
        }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#fbbf24", marginBottom: 6 }}>📌 ch2 최종 결론</div>
          <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.7 }}>
            <b style={{ color: "#6ee7b7" }}>가격</b>: 중앙 72만(이론패키지 최저). 메가 86.7만(여름특가·6/24마감). 배움 88.24만(고정가).{" "}
            <b style={{ color: "#6ee7b7" }}>영상제어</b>: 메가 0개 &gt; 중앙 6개(ratechange✗) &gt; 배움 17개 &gt; 해커스 ~20개.{" "}
            <b style={{ color: "#fbbf24" }}>💎 하이라이트</b>: 해커스 진도저장이{" "}
            <b style={{ color: "#fbbf24" }}>완전 평문(video_time float POST)</b> — ch4 자동화 셋업 핵심 실마리.{" "}
            <b style={{ color: "#fda4af" }}>Kstudy·유비온 패스 확정. 최단 3학기·~2028 상반기는 불변.</b>
          </div>
        </div>

        {/* ── 01 핵심 3축 ── */}
        <div style={{ marginBottom: 30 }}>
          <SectionTitle no="01" title="실측 3줄 요약" sub="ch2 최종 — 가설 말고 직접 찍은 것" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 12 }}>
            {[
              { ic: <DollarSign size={20} />, t: "최저 실결제", v: "중앙 72만", d: "정가 240만→70%할인. 메가 86.7만 프로모션 2위(6/24마감)", s: "best" },
              { ic: <Zap size={20} />, t: "영상 최청정", v: "메가 리스너 0개", d: "배속·건너뛰기·탭이탈 전부 감지 안 함. 5곳 최청정.", s: "best" },
              { ic: <Bot size={20} />, t: "진도저장 평문", v: "해커스 video_time", d: "lecture.Videotime.ajax.php에 float 그대로 POST. 암호화 없음.", s: "ok" },
            ].map((x, i) => (
              <Card key={i} style={{ padding: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: B.ink, marginBottom: 8 }}>
                  {x.ic}<span style={{ fontSize: 14, fontWeight: 800 }}>{x.t}</span>
                  <span style={{ marginLeft: "auto" }}><Chip status={x.s} /></span>
                </div>
                <div style={{ fontSize: 19, fontWeight: 900, color: B.ink, marginBottom: 6 }}>{x.v}</div>
                <div style={{ fontSize: 12.5, color: B.sub, fontWeight: 600, lineHeight: 1.5 }}>{x.d}</div>
              </Card>
            ))}
          </div>
        </div>

        {/* ── 02 영상제어 청정도 ── */}
        <div style={{ marginBottom: 30 }}>
          <SectionTitle no="02" title="영상제어 청정도" sub="감지 리스너 수 — 적을수록 자동화 유리 (실측 4곳)" />
          <Card>
            {tested.map((s, i) => (
              <div key={s.id} style={{ padding: "12px 0", borderBottom: i < tested.length - 1 ? "1.5px dashed #d6ccb5" : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <span style={{ fontWeight: 900, fontSize: 14.5, color: B.ink, minWidth: 90 }}>{s.name}</span>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: B.sub }}>{s.lmsLabel}</span>
                  <span style={{ marginLeft: "auto", display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
                    <Chip status={s.ratechange ? "limited" : "best"} text={s.ratechange ? "ratechange ⚠️" : "ratechange ✗"} />
                  </span>
                </div>
                <CleanlinessBar listeners={s.listeners} />
                {s.highlight && (
                  <div style={{ marginTop: 8, fontSize: 12, fontWeight: 800, color: "#b45309", background: "#fef3c7", border: "1.5px solid #d97706", borderRadius: 8, padding: "5px 9px" }}>
                    {s.highlight}
                  </div>
                )}
              </div>
            ))}
            <div style={{ marginTop: 12, fontSize: 12, color: B.sub, fontWeight: 600, lineHeight: 1.5 }}>
              ※ <b>메가 0개</b> = 완전 비어있음(배속·건너뛰기 감지 전무). <b>중앙 6개</b> = ratechange 없어 배속 안 막음. <b>배움 17개</b> = ratechange 있으나 맛보기 404로 실제 작동 미확인. <b>해커스 ~20개</b> = ratechange+seeking 있으나 진도저장은 평문.
            </div>
          </Card>
        </div>

        {/* ── 03 진도저장 방식 ── */}
        <div style={{ marginBottom: 30 }}>
          <SectionTitle no="03" title="진도저장 방식" sub="Payload 분석 — ch4 자동화 셋업의 핵심" />
          <Card>
            {tested.map((s, i) => {
              const isPayload = s.progressPayload && s.progressPayload.includes("float");
              return (
                <div key={s.id} style={{ padding: "10px 0", borderBottom: i < tested.length - 1 ? "1.5px dashed #d6ccb5" : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <span style={{ fontWeight: 900, fontSize: 13.5, color: B.ink, minWidth: 90 }}>{s.name}</span>
                    <Chip status={isPayload ? "best" : "unknown"} text={isPayload ? "✅ 평문 확인" : "❓ 미확인"} />
                  </div>
                  <div style={{ fontSize: 12.5, color: isPayload ? B.ink : B.sub, fontWeight: isPayload ? 800 : 600, lineHeight: 1.4, fontFamily: isPayload ? "ui-monospace, monospace" : "inherit" }}>
                    {s.progressPayload}
                  </div>
                </div>
              );
            })}
            <div style={{ marginTop: 10, fontSize: 12, color: B.sub, fontWeight: 600 }}>
              ※ 맛보기는 부모페이지가 끊겨 Network 측정 불가(정상). 정식 로그인 강의실에서만 Fetch/XHR 확인 가능. 배움·중앙·메가는 ch4 정식등록 후 재확인 필요.
            </div>
          </Card>
        </div>

        {/* ── 04 실결제 가격 랭킹 ── */}
        <div style={{ marginBottom: 30 }}>
          <SectionTitle no="04" title="실결제 가격 랭킹" sub="17과목 기준 (해커스 조건부·패스 2곳 제외)" />
          <Card>
            {priceRank.map((s, i) => {
              const max = 882400;
              const w = Math.max(8, (s.priceNum / max) * 100);
              const cheapest = i === 0;
              return (
                <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: i < priceRank.length - 1 ? "1.5px dashed #d6ccb5" : "none" }}>
                  <span style={{ width: 18, fontWeight: 900, fontSize: 14, color: cheapest ? "#047857" : B.sub }}>{i + 1}</span>
                  <span style={{ width: 92, fontWeight: 800, fontSize: 13.5, color: B.ink }}>{s.name}</span>
                  <div style={{ flex: 1, height: 18, background: "#efe9da", border: `1.5px solid ${B.ink}`, borderRadius: 999, overflow: "hidden" }}>
                    <div style={{ width: `${w}%`, height: "100%", background: cheapest ? "#6ee7b7" : "#fcd9a8", borderRight: `1.5px solid ${B.ink}` }} />
                  </div>
                  <span style={{ width: 90, textAlign: "right", fontWeight: 900, fontSize: 13.5, color: B.ink }}>{s.priceLabel}</span>
                </div>
              );
            })}
            <div style={{ marginTop: 10, fontSize: 12, color: B.sub, fontWeight: 600 }}>
              ※ 메가 86.7만은 여름초특가(6/24 마감). 중앙·메가 모두 상담 쿠폰 변수 있어 최종 결제 직전 재확인. 총비용에 실습세미나·실습기관비·행정비 별도.
            </div>
          </Card>
        </div>

        {/* ── 05 교육원별 상세 ── */}
        <div style={{ marginBottom: 30 }}>
          <SectionTitle no="05" title="교육원별 상세" sub="행을 누르면 펼쳐져요 · 실측 4 + 패스 2" />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
            {["best", "ok", "limited", "unknown"].map((k) => (
              <Chip key={k} status={k} />
            ))}
            <Chip status="no" text="패스" />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {SITES.map((s) => {
              const isOpen = open === s.id;
              return (
                <div key={s.id} style={{
                  background: B.card, border: `2px solid ${B.ink}`, borderRadius: 14,
                  boxShadow: isOpen ? B.shadow : B.shadowSm,
                  opacity: s.passed ? 0.6 : 1,
                }}>
                  <button
                    onClick={() => setOpen(isOpen ? null : s.id)}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", ...font }}
                  >
                    {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    <span style={{
                      fontSize: 16, fontWeight: 900, color: B.ink, minWidth: 96,
                      textDecoration: s.passed ? "line-through" : "none",
                    }}>{s.name}</span>
                    <span style={{ fontSize: 11.5, fontWeight: 800, color: B.sub }}>{s.tag}</span>
                    <span style={{ marginLeft: "auto", display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
                      {!s.passed && <Chip status="ok" text={`💸 ${s.priceLabel}`} />}
                      <Chip
                        status={s.passed ? "no" : s.autoVerdict}
                        text={s.passed ? "🚫 패스" : s.tested ? "⚠️ 부분" : "미조사"}
                      />
                    </span>
                  </button>

                  {isOpen && (
                    <div style={{ padding: "0 16px 16px", borderTop: "1.5px dashed #d6ccb5" }}>
                      {s.passed ? (
                        <div style={{ padding: "14px 0", display: "flex", alignItems: "center", gap: 10 }}>
                          <Ban size={20} color="#be123c" />
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 900, color: "#be123c", marginBottom: 4 }}>이번 선정에서 제외</div>
                            <div style={{ fontSize: 13, color: B.sub, fontWeight: 600, lineHeight: 1.5 }}>{s.memo}</div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 8, margin: "14px 0" }}>
                            {[
                              ["LMS", <Chip status={s.lms} text={s.lmsLabel} />],
                              ["감지 리스너", <span style={{ fontSize: 14, fontWeight: 900, color: B.ink }}>{s.listeners === null ? "미측정" : s.listeners === 0 ? "0개 🏆" : `${s.listeners}개`}</span>],
                              ["과목당", <span style={{ fontSize: 13, fontWeight: 800, color: B.ink }}>{s.perSubject}</span>],
                              ["진도저장", <span style={{ fontSize: 11.5, fontWeight: 700, color: s.progressPayload.includes("float") ? "#047857" : B.sub }}>{s.progressPayload.includes("float") ? "평문 ✅" : "미확인 ❓"}</span>],
                            ].map(([label, node], j) => (
                              <div key={j} style={{ background: B.cream, border: `1.5px solid ${B.ink}`, borderRadius: 10, padding: "8px 10px" }}>
                                <div style={{ fontSize: 11, fontWeight: 700, color: B.sub, marginBottom: 4 }}>{label}</div>
                                {node}
                              </div>
                            ))}
                          </div>

                          {s.highlight && (
                            <div style={{ display: "flex", gap: 8, marginBottom: 10, background: "#fef3c7", border: `2px solid #d97706`, borderRadius: 10, padding: "10px 12px" }}>
                              <div style={{ fontSize: 13, fontWeight: 800, color: "#92400e", lineHeight: 1.4 }}>{s.highlight}</div>
                            </div>
                          )}

                          <div style={{ display: "flex", alignItems: "flex-start", gap: 7, marginBottom: 10, background: "#fff1f2", border: `1.5px solid ${B.ink}`, borderRadius: 10, padding: "9px 11px" }}>
                            <Lock size={15} style={{ marginTop: 2, flexShrink: 0, color: "#be123c" }} />
                            <div>
                              <div style={{ fontSize: 11, fontWeight: 800, color: "#be123c" }}>로그인 장벽 (진짜 관문)</div>
                              <div style={{ fontSize: 12.5, fontWeight: 700, color: B.ink, lineHeight: 1.4 }}>{s.login}</div>
                            </div>
                          </div>

                          <div style={{ marginBottom: 12 }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: B.sub, marginBottom: 4 }}>진도저장 Payload</div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: s.progressPayload.includes("float") ? "#047857" : B.sub, fontFamily: "ui-monospace, monospace", lineHeight: 1.5 }}>
                              {s.progressPayload}
                            </div>
                          </div>

                          <div style={{ fontSize: 13, color: B.ink, fontWeight: 600, lineHeight: 1.55, marginBottom: 12 }}>{s.memo}</div>
                          <a href={`https://${s.url}`} target="_blank" rel="noreferrer"
                            style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12.5, fontWeight: 800, color: B.ink, textDecoration: "none", borderBottom: `2px solid #fbbf24` }}>
                            <ExternalLink size={13} /> {s.url}
                          </a>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── 06 냉정한 한계점 ── */}
        <div style={{ marginBottom: 30 }}>
          <SectionTitle no="06" title="냉정한 한계점" sub="실측했어도 아직 모르는 것" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 12 }}>
            {[
              { ic: <Activity size={18} color="#b45309" />, t: "진도저장 3곳 미확인", d: "배움·중앙·메가는 맛보기 Network 측정 불가. 정식 등록 후 Fetch/XHR에서 확인해야 최종 ✅/❌. 해커스는 평문 확인됐으나 서버가 속도 검증 안 하는지는 추가 확인 필요." },
              { ic: <Lock size={18} color="#be123c" />, t: "영상 깨끗 ≠ 자동화 가능", d: "메가는 영상 리스너 0개지만 IP출석+생체/OTP가 진짜 관문. 영상제어 청정도와 로그인 장벽은 별개 문제." },
              { ic: <AlertTriangle size={18} color="#b45309" />, t: "배움 실측 불가 상태", d: "맛보기 소스 404로 영상이 안 재생됨. ratechange 17개가 실제 배속을 막는지 미확인. 정식 강의실 재검증 필수." },
              { ic: <XCircle size={18} color="#1d4ed8" />, t: "메가 6/24 마감 임박", d: "여름초특가 86.7만이 오늘(6/22) 기준 이틀 남음. 실질 결정이 필요하다면 오늘 내일 안에." },
            ].map((x, i) => (
              <Card key={i} style={{ padding: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
                  {x.ic}<span style={{ fontSize: 14, fontWeight: 900, color: B.ink }}>{x.t}</span>
                </div>
                <div style={{ fontSize: 12.5, color: B.sub, fontWeight: 600, lineHeight: 1.55 }}>{x.d}</div>
              </Card>
            ))}
          </div>
        </div>

        {/* ── 07 ch3 액션 플랜 ── */}
        <div style={{ marginBottom: 24 }}>
          <SectionTitle no="07" title="ch3로 넘어가기" sub="기관 확정 → 수강신청 전략" />
          <Card>
            {[
              ["메가 6/24 마감 전 의사결정", "가격·영상청정도 1위지만 IP출석 장벽. 오늘~내일 최종 결정."],
              ["중앙 or 메가 — 로그인 장벽 최종 확인", "중앙: ID/PW 로그인으로 수강까지 되는지 / 메가: IP출석 구조 상세"],
              ["2026 2학기 8과목 신청 (시나리오 B)", "필수4 확보 → 실습을 2027 1학기로 당기는 핵심 타이밍"],
              ["ch4 자동화 셋업 준비", "해커스 진도저장 평문 실마리 + 선택 기관 정식 등록 후 Playwright 작성"],
              ["현장실습기관 미리 섭외 시작", "welfare.net 등록기관, 주말·야간 가능처 2027 초부터 연락"],
            ].map(([t, d], i) => (
              <div key={i} style={{ display: "flex", gap: 12, padding: "11px 0", borderBottom: i < 4 ? "1.5px dashed #d6ccb5" : "none" }}>
                <span style={{ width: 26, height: 26, flexShrink: 0, borderRadius: 8, background: "#fde68a", border: `2px solid ${B.ink}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 13 }}>{i + 1}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: B.ink }}>{t}</div>
                  <div style={{ fontSize: 12.5, color: B.sub, fontWeight: 600, marginTop: 2 }}>{d}</div>
                </div>
              </div>
            ))}
          </Card>
        </div>

        <div style={{ textAlign: "center", fontSize: 11.5, color: "#a8a29e", fontWeight: 700, marginTop: 28 }}>
          🥈 사회복지사 2급 · Season 1 Chapter 2 마무리 · F12 실측: 배움·중앙·메가·해커스 완료 · Kstudy·유비온 패스
        </div>
      </div>
    </div>
  );
}
