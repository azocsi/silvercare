import React, { useState, useMemo } from "react";
import {
  Trophy, DollarSign, Bot, Calendar, GraduationCap, ChevronDown, ChevronRight,
  CheckCircle2, AlertTriangle, XCircle, HelpCircle, ListChecks, Clock, ExternalLink,
} from "lucide-react";

/**
 * 사회복지사 2급 교육원 비교 — "러닝화니(DeviceComparison)" 스타일
 * 뉴브루탈리즘 + 베이지 크림톤 + 섹션번호 + 4단계 색상(emerald/blue/amber/rose)
 * 자동화 체크리스트를 클릭으로 체크하면 실시간 판정이 갱신됩니다.
 */

// ── 디자인 토큰 ──────────────────────────────────────────────
const B = {
  ink: "#1c1917",
  cream: "#fdfcf7",
  card: "#fffdf8",
  sub: "#78716c",
  line: "#1c1917",
  shadow: "4px 4px 0 0 #1c1917",
  shadowSm: "2px 2px 0 0 #1c1917",
};
// 4단계 상태 색상
const ST = {
  best:    { label: "최적",  c: "#047857", bg: "#d1fae5", dot: "#059669" },
  ok:      { label: "가능",  c: "#1d4ed8", bg: "#dbeafe", dot: "#2563eb" },
  limited: { label: "제한",  c: "#b45309", bg: "#fef3c7", dot: "#d97706" },
  risk:    { label: "주의",  c: "#be123c", bg: "#ffe4e6", dot: "#e11d48" },
  no:      { label: "불가",  c: "#be123c", bg: "#ffe4e6", dot: "#e11d48" },
  unknown: { label: "미확인", c: "#57534e", bg: "#e7e5e4", dot: "#a8a29e" },
};

// ── 데이터 ───────────────────────────────────────────────────
const SITES = [
  {
    id: "baeoom", name: "배움사이버", url: "career.baeoom.com", tag: "✅ 가입완료",
    priceLabel: "4.5만", priceNum: 45000, total: "≈140만",
    credit: "ok", subjects: "unknown", enroll: "unknown", practicum: "unknown",
    lms: "unknown", lmsLabel: "미확인", auto: "unknown",
    memo: "구형 EUC-KR 스택 → 감지 로직 단순 가능성(자동화 유리 기대). 공개가 기준 가장 저렴·투명. 진도요청 평문 여부만 확인하면 됨.",
    priceNote: "5과목↑ 기준. 공개 고정가 중 최저",
  },
  {
    id: "hackers", name: "해커스", url: "paranhanul.net", tag: "💰 이벤트가",
    priceLabel: "9,700원*", priceNum: 9700, total: "≈120만",
    credit: "ok", subjects: "best", enroll: "unknown", practicum: "limited",
    lms: "unknown", lmsLabel: "미확인", auto: "unknown",
    memo: "PC·모바일 100% 연동 → HTML5 가능성↑. 단 9,700원은 7과목↑ 결제+최대80% 할인 조건부(정가는 더 높음). 간접실습 80h 대체 가능.",
    priceNote: "★조건부 이벤트가 — 정가/취소조건 확인 필수",
  },
  {
    id: "kstudy", name: "Kstudy", url: "kstudy.co.kr", tag: "🏛️ 22년 안정",
    priceLabel: "6.9만", priceNum: 69000, total: "≈180만",
    credit: "ok", subjects: "best", enroll: "unknown", practicum: "unknown",
    lms: "unknown", lmsLabel: "미확인", auto: "unknown",
    memo: "2003년 설립·22년 평가인정. 출석률 80%+시험 60분 1회 → 시험은 무조건 수동. 한 학기 최대 8과목.",
    priceNote: "패키지 고정가",
  },
  {
    id: "mega", name: "메가원격", url: "caedu.co.kr", tag: "⚠️ IP출석",
    priceLabel: "상담가", priceNum: 999999, total: "≈180만",
    credit: "ok", subjects: "best", enroll: "unknown", practicum: "limited",
    lms: "unknown", lmsLabel: "미확인", auto: "risk",
    memo: "IP 출석 1인 + 대리출석 차단(생체/OTP/PIN/SMS/PKI) 명시 → 자동화 가장 빡셀 가능성. 단 이는 교육부 지침이라 타 기관도 정도 차이만.",
    priceNote: "비공개 — 시장 통상 7~9만 추정",
  },
  {
    id: "joongang", name: "중앙사이버", url: "joongangcyber.com", tag: "🔎 iframe확인",
    priceLabel: "15만 (할인~10.5만)", priceNum: 150000, total: "≈230만",
    credit: "ok", subjects: "best", enroll: "ok", practicum: "limited",
    lms: "iframe", lmsLabel: "iframe", auto: "unknown",
    memo: "맛보기 플레이어=iframe(id=contents, src=media.joongangcyber.com/.../01.html) → iframe 내부 재진입해서 분석 필요. 6/24·12/23·6/23 개강반 운영.",
    priceNote: "정가 15만 / 이론 패키지 할인 168만. 가장 비싼 편",
  },
  {
    id: "ubion", name: "유비온", url: "iubion.com", tag: "❓ 미조사",
    priceLabel: "미조사", priceNum: 9999999, total: "—",
    credit: "unknown", subjects: "unknown", enroll: "unknown", practicum: "unknown",
    lms: "unknown", lmsLabel: "미확인", auto: "unknown",
    memo: "신규 후보. 가격·과목·학점은행·LMS 전부 다음 세션에 조사 예정.",
    priceNote: "미조사",
  },
];

const CHECK_ITEMS = [
  "HTML5 video 잡힘 (iframe/DRM 아님)",
  "JS 제어 OK (play() · 배속변경)",
  "탭이탈·seeking·배속 감지 없음",
  "진도저장 평문 (토큰·서명 없음)",
  "재인증 팝업(생체/OTP/PIN) 없음",
  "IP 1인·동시재생 제한 없음",
];

// 체크 개수 → 판정
function verdictOf(count, touched) {
  if (!touched) return { ...ST.unknown, label: "미확인", txt: "아직 체크 안 함" };
  if (count === 6) return { ...ST.best, label: "✅ 자동화 가능", txt: "6/6 통과" };
  if (count >= 3) return { ...ST.limited, label: "⚠️ 부분 가능", txt: `${count}/6 — 조건부` };
  return { ...ST.no, label: "❌ 자동화 불가", txt: `${count}/6 — 막힘` };
}

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

// ── 메인 ─────────────────────────────────────────────────────
export default function SocialWorkerAcademyCompare() {
  const [open, setOpen] = useState("joongang");
  const [checks, setChecks] = useState(() =>
    Object.fromEntries(SITES.map((s) => [s.id, [false, false, false, false, false, false]]))
  );

  const toggle = (id, i) =>
    setChecks((p) => {
      const next = p[id].slice();
      next[i] = !next[i];
      return { ...p, [id]: next };
    });

  // 가격 랭킹 (공개 고정가 기준, 상담가/미조사 제외)
  const priceRank = useMemo(
    () => SITES.filter((s) => s.priceNum < 900000).sort((a, b) => a.priceNum - b.priceNum),
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
          <span style={{
            display: "inline-block", fontSize: 12, fontWeight: 800, color: B.ink,
            background: "#fde68a", border: `2px solid ${B.ink}`, borderRadius: 999,
            padding: "4px 12px", boxShadow: B.shadowSm,
          }}>🎓 사회복지사 2급 · 교육원 비교</span>
          <h1 style={{ fontSize: 34, fontWeight: 900, color: B.ink, margin: "14px 0 2px", lineHeight: 1.05 }}>
            최저가 × 자동화 가능
          </h1>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: B.sub, margin: 0, lineHeight: 1.1 }}>
            후회 없는 최단기 자격증 취득 비교표
          </h2>
        </div>

        {/* ── 한 줄 결론 ── */}
        <div style={{
          background: B.ink, color: "#fdfcf7", border: `2px solid ${B.ink}`, borderRadius: 14,
          boxShadow: B.shadow, padding: 18, marginBottom: 26,
        }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#fbbf24", marginBottom: 6 }}>📌 지금까지의 결론</div>
          <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.6 }}>
            <b>가격</b>은 공개 고정가 기준 <b style={{ color: "#6ee7b7" }}>배움(4.5만)</b>이 가장 투명한 최저가
            (해커스 9,700원은 조건부). <b>자동화</b>는 아직 5곳 전부 <b style={{ color: "#fbbf24" }}>미확정</b> —
            F12로 직접 찍어야 확정돼. 중앙은 <b>iframe</b> 확인됨(분석 한 단계 더 필요), 메가는 IP·재인증으로
            가장 빡셀 가능성. <b style={{ color: "#fda4af" }}>선수학점 0이라 17과목 풀 → 최단 3학기 → 발급 ~2028 상반기</b>는 못 피함.
          </div>
        </div>

        {/* ── 01 핵심 3축 ── */}
        <div style={{ marginBottom: 30 }}>
          <SectionTitle no="01" title="핵심 3축" sub="이 세 개만 충족하면 후회 없음" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 12 }}>
            {[
              { ic: <DollarSign size={20} />, t: "최저가", v: "배움 4.5만", d: "공개 고정가 최저·투명. 해커스 9,700원은 7과목↑ 조건부", s: "best" },
              { ic: <Bot size={20} />, t: "자동화", v: "전부 미확정", d: "F12 분석 필요. 중앙=iframe, 메가=IP출석 빡셈", s: "unknown" },
              { ic: <Calendar size={20} />, t: "최단 취득", v: "3학기·2028 상반기", d: "17과목 풀 / 학기 8과목 상한 → 물리적 바닥", s: "limited" },
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

        {/* ── 02 가격 랭킹 ── */}
        <div style={{ marginBottom: 30 }}>
          <SectionTitle no="02" title="가격 랭킹" sub="과목당 공개가 (상담가·미조사 제외)" />
          <Card>
            {priceRank.map((s, i) => {
              const max = 150000;
              const w = Math.max(8, (s.priceNum / max) * 100);
              const cheapest = i === 0;
              return (
                <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: i < priceRank.length - 1 ? "1.5px dashed #d6ccb5" : "none" }}>
                  <span style={{ width: 18, fontWeight: 900, fontSize: 14, color: cheapest ? "#047857" : B.sub }}>{i + 1}</span>
                  <span style={{ width: 92, fontWeight: 800, fontSize: 13.5, color: B.ink }}>{s.name}</span>
                  <div style={{ flex: 1, height: 18, background: "#efe9da", border: `1.5px solid ${B.ink}`, borderRadius: 999, overflow: "hidden" }}>
                    <div style={{ width: `${w}%`, height: "100%", background: cheapest ? "#6ee7b7" : "#fcd9a8", borderRight: `1.5px solid ${B.ink}` }} />
                  </div>
                  <span style={{ width: 110, textAlign: "right", fontWeight: 900, fontSize: 13.5, color: B.ink }}>{s.priceLabel}</span>
                </div>
              );
            })}
            <div style={{ marginTop: 10, fontSize: 12, color: B.sub, fontWeight: 600 }}>
              ※ 메가원격·유비온은 가격 비공개/미조사. 총 예상비용엔 실습세미나(~50만)·실습기관비·행정비 별도 포함.
            </div>
          </Card>
        </div>

        {/* ── 03 비교 매트릭스 + 자동화 체크 ── */}
        <div style={{ marginBottom: 30 }}>
          <SectionTitle no="03" title="비교 매트릭스" sub="행을 누르면 펼쳐져요 · 자동화 항목은 직접 체크 ✅" />

          {/* 범례 */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
            {["best", "ok", "limited", "risk", "unknown"].map((k) => (
              <Chip key={k} status={k} text={`${ST[k].label}`} />
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {SITES.map((s) => {
              const isOpen = open === s.id;
              const count = checks[s.id].filter(Boolean).length;
              const touched = checks[s.id].some(Boolean);
              const vd = verdictOf(count, touched);
              return (
                <div key={s.id} style={{ background: B.card, border: `2px solid ${B.ink}`, borderRadius: 14, boxShadow: isOpen ? B.shadow : B.shadowSm }}>
                  {/* 행 헤더 */}
                  <button
                    onClick={() => setOpen(isOpen ? null : s.id)}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", ...font }}
                  >
                    {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    <span style={{ fontSize: 16, fontWeight: 900, color: B.ink, minWidth: 96 }}>{s.name}</span>
                    <span style={{ fontSize: 11.5, fontWeight: 800, color: B.sub }}>{s.tag}</span>
                    <span style={{ marginLeft: "auto", display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
                      <Chip status="ok" text={`💸 ${s.priceLabel}`} />
                      <Chip status={touched ? vd.c === ST.best.c ? "best" : count >= 3 ? "limited" : "no" : "unknown"} text={touched ? vd.label : "자동화 ?"} />
                    </span>
                  </button>

                  {/* 펼침 본문 */}
                  {isOpen && (
                    <div style={{ padding: "0 16px 16px", borderTop: `1.5px dashed #d6ccb5` }}>
                      {/* 스펙 그리드 */}
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 8, margin: "14px 0" }}>
                        {[
                          ["학점은행", s.credit], ["17과목", s.subjects], ["이번학기", s.enroll],
                          ["실습연계", s.practicum], ["LMS", s.lms],
                        ].map(([label, st]) => (
                          <div key={label} style={{ background: B.cream, border: `1.5px solid ${B.ink}`, borderRadius: 10, padding: "8px 10px" }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: B.sub, marginBottom: 4 }}>{label}</div>
                            <Chip status={st} text={label === "LMS" ? s.lmsLabel : undefined} />
                          </div>
                        ))}
                        <div style={{ background: B.cream, border: `1.5px solid ${B.ink}`, borderRadius: 10, padding: "8px 10px" }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: B.sub, marginBottom: 4 }}>총예상</div>
                          <div style={{ fontSize: 14, fontWeight: 900, color: B.ink }}>{s.total}</div>
                        </div>
                      </div>

                      {/* 가격 메모 + URL */}
                      <div style={{ fontSize: 12.5, color: "#b45309", fontWeight: 700, marginBottom: 6 }}>💸 {s.priceNote}</div>
                      <div style={{ fontSize: 13, color: B.ink, fontWeight: 600, lineHeight: 1.55, marginBottom: 12 }}>{s.memo}</div>
                      <a href={`https://${s.url}`} target="_blank" rel="noreferrer"
                        style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12.5, fontWeight: 800, color: B.ink, textDecoration: "none", borderBottom: `2px solid #fbbf24`, marginBottom: 16 }}>
                        <ExternalLink size={13} /> {s.url}
                      </a>

                      {/* 자동화 체크리스트 */}
                      <div style={{ background: B.cream, border: `2px solid ${B.ink}`, borderRadius: 12, padding: 14 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
                          <ListChecks size={16} />
                          <span style={{ fontSize: 13.5, fontWeight: 900, color: B.ink }}>F12 자동화 체크 (직접 찍으며 클릭)</span>
                          <span style={{ marginLeft: "auto" }}>
                            <Chip status={touched ? (count === 6 ? "best" : count >= 3 ? "limited" : "no") : "unknown"} text={`${vd.label} · ${vd.txt}`} />
                          </span>
                        </div>
                        {CHECK_ITEMS.map((label, i) => {
                          const on = checks[s.id][i];
                          return (
                            <button key={i} onClick={() => toggle(s.id, i)}
                              style={{ width: "100%", display: "flex", alignItems: "center", gap: 9, padding: "8px 6px", background: "transparent", border: "none", borderBottom: i < 5 ? "1px solid #e6ddc8" : "none", cursor: "pointer", textAlign: "left", ...font }}>
                              {on
                                ? <CheckCircle2 size={18} color="#059669" />
                                : <span style={{ width: 18, height: 18, borderRadius: 6, border: `2px solid ${B.ink}`, flexShrink: 0 }} />}
                              <span style={{ fontSize: 13, fontWeight: on ? 800 : 600, color: on ? B.ink : B.sub, textDecoration: on ? "none" : "none" }}>{label}</span>
                            </button>
                          );
                        })}
                        <div style={{ marginTop: 8, fontSize: 11.5, color: B.sub, fontWeight: 600 }}>
                          6/6 = ✅ 가능 · 3~5 = ⚠️ 부분 · 0~2 = ❌ 불가 &nbsp;|&nbsp; 출석·시험·과제·토론은 어디든 수동
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── 04 솔직한 한계점 ── */}
        <div style={{ marginBottom: 30 }}>
          <SectionTitle no="04" title="냉정한 한계점" sub="광고 말고 사실만" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 12 }}>
            {[
              { ic: <AlertTriangle size={18} color="#b45309" />, t: "자동화는 아직 0확정", d: "5곳 다 F12 직접 분석 전. 표의 자동화 칸은 가설일 뿐. 체크 끝나야 확정." },
              { ic: <XCircle size={18} color="#be123c" />, t: "해커스 9,700원의 함정", d: "7과목↑ 대량결제 + 최대80% 이벤트 조건. 정가·취소조건 모르면 비교 왜곡." },
              { ic: <AlertTriangle size={18} color="#b45309" />, t: "메가 IP·재인증", d: "IP 1인 + 생체/OTP/PIN 대리출석 차단. 자동화 가장 불리할 수 있음." },
              { ic: <Clock size={18} color="#1d4ed8" />, t: "2028 상반기는 못 피함", d: "석사 있어도 인정과목 0 → 17과목 풀 → 3학기. 시험·과제는 수동이라 학기당 부담 큼." },
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

        {/* ── 05 액션 플랜 ── */}
        <div style={{ marginBottom: 24 }}>
          <SectionTitle no="05" title="실행 액션 플랜" sub="순서대로만 가면 후회 없음" />
          <Card>
            {[
              ["cb.or.kr 학점원부 확인", "선수학점 0 재확인 → 17과목 풀 확정 (이미 확인됨)"],
              ["F12로 자동화 체크 (위 03 사용)", "중앙(iframe)→메가(빡셈)→배움→해커스→Kstudy→유비온 순"],
              ["최저가 × 자동화 가능 교차점 선택", "공개가 최저(배움) + 자동화 ✅ 나오는 곳 우선"],
              ["2026 2학기 8과목 신청", "현장실습 선이수(필수4+선택2) 1학기차 완성 = 시나리오 B"],
              ["현장실습 기관 미리 섭외", "welfare.net 등록기관, 주말·야간 가능처 2027 초부터"],
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

        {/* ── 푸터 ── */}
        <div style={{ textAlign: "center", fontSize: 11.5, color: "#a8a29e", fontWeight: 700, marginTop: 28 }}>
          🥈 사회복지사 2급 교육원 비교 · 러닝화니 스타일 · 자동화 칸은 F12 체크 후 확정
        </div>
      </div>
    </div>
  );
}
