import React, { useState } from "react";
import {
  ChevronDown, ChevronRight, Home, Phone, AlertTriangle,
  XCircle, Clock, FileCheck, Scale,
} from "lucide-react";

/**
 * hwanee.com/silvercare · 노후준비 #002
 * 「통합돌봄 오해 5가지 — 자녀가 대신 확인할 진짜」
 * 공개본. 독자 = 부모님 돌봄을 고민하는 자녀.
 * ※ 진단·처방·치료 안내 아님. 제도 절차 정보 정리.
 */

const B = {
  ink: "#1c1917", cream: "#fdfcf7", card: "#fffdf8", sub: "#78716c",
  shadow: "4px 4px 0 0 #1c1917", shadowSm: "2px 2px 0 0 #1c1917",
};
// 본문 = Pretendard(가독성). 제목 = 나눔스퀘어 Neo ExtraBold.
// ★ 이 폰트는 웨이트 번호가 비표준이다. ExtraBold = 700 (800은 Heavy).
//   900을 쓰면 매칭 실패로 Pretendard로 떨어지니 제목엔 반드시 700을 쓸 것.
const FONT_BODY = "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif";
const FONT_DISPLAY = `"NanumSquareNeo", ${FONT_BODY}`;
const D = { fontFamily: FONT_DISPLAY, fontWeight: 700 };

const ST = {
  best:    { label: "확정",   c: "#047857", bg: "#d1fae5", dot: "#059669" },
  ok:      { label: "대체로", c: "#1d4ed8", bg: "#dbeafe", dot: "#2563eb" },
  limited: { label: "지역차", c: "#b45309", bg: "#fef3c7", dot: "#d97706" },
  no:      { label: "주의",   c: "#be123c", bg: "#ffe4e6", dot: "#e11d48" },
  unknown: { label: "미확인", c: "#57534e", bg: "#e7e5e4", dot: "#a8a29e" },
};

// ── 30초 요약 ────────────────────────────────────────────────
const QUICK = [
  { t: "언제부터", v: "2026.3.27", s: "best", d: "돌봄통합지원법 전국 본사업 시행. 시범사업 끝났고 지금은 전국 어디서나 돌아가는 제도." },
  { t: "무엇이 바뀌나", v: "한 번 신청", s: "best", d: "따로따로 신청하던 의료·요양·돌봄을 지자체가 하나의 돌봄 계획으로 묶어서 연계." },
  { t: "어디에", v: "읍·면·동", s: "best", d: "주소지 행정복지센터 또는 국민건강보험공단 지사. 둘 다 창구." },
];

// ── 오해 5가지 ───────────────────────────────────────────────
const MYTHS = [
  {
    id: "m1",
    myth: "장기요양 등급이 있어야 신청할 수 있다",
    truth: "등급이 없어도 신청 대상이 될 수 있다",
    level: "ok",
    body: [
      "장기요양 등급이 없더라도 실제 일상생활에 어려움이 확인되면 지자체 판단으로 지원 가능성이 열려 있다.",
      "대상 선정 기준이 소득 수준이 아니라 '돌봄의 시급성'과 '복합적 욕구' 중심이다.",
      "등급 신청에서 떨어진 뒤 '그럼 아무것도 못 받나' 하고 포기한 경우가 많은데, 통합돌봄은 그 지점을 겨냥해 만들어진 제도다.",
      "단, 최종 판단은 지자체가 한다. 상담 자체를 막는 조건은 아니니 일단 문의해보는 게 맞다.",
    ],
  },
  {
    id: "m2",
    myth: "예전 '노인맞춤돌봄'이랑 이름만 바뀐 것",
    truth: "묶이는 범위가 다르다 — 의료가 들어왔다",
    level: "best",
    body: [
      "기존 장기요양 서비스는 '요양'에 집중돼 있었다.",
      "통합돌봄은 여기에 방문진료 같은 의료와 식사·주거 지원을 함께 묶는 구조다.",
      "예전에는 장기요양 등급을 받으면 식사·이동·주거 서비스를 중복으로 받기 어려웠다. 담당 기관이 달라(건보공단 / 지자체) 정보가 따로 놀았기 때문.",
      "그 '따로 놀던 구조'를 하나의 계획으로 통합하는 게 이 법의 핵심이다.",
    ],
  },
  {
    id: "m3",
    myth: "본인이 직접 신청해야만 한다",
    truth: "직권 발굴로 연결되는 경로도 있다",
    level: "ok",
    body: [
      "본인 신청이 어려운 경우에도 공무원·전문가의 직권 발굴로 지원이 연결될 수 있다.",
      "실제로 2026년 하반기 들어 지자체들이 전수조사·현장조사로 대상자를 먼저 찾아 나서고 있다.",
      "다만 '알아서 찾아와 주겠지'는 위험하다. 자녀가 먼저 읍·면·동에 문의하는 쪽이 훨씬 빠르다.",
      "부모님이 지방에 계시고 자녀가 수도권이면, 문의 창구는 부모님 '주소지' 기준이다.",
    ],
  },
  {
    id: "m4",
    myth: "신청하면 바로 서비스가 시작된다",
    truth: "가정 방문 조사와 계획 수립 기간이 든다",
    level: "limited",
    body: [
      "신청 후 가정을 방문해 욕구 조사를 거치고, 개인별 지원 계획을 세우는 기간이 필요하다.",
      "즉 '내일 퇴원인데 오늘 신청'은 타이밍이 빠듯하다. 퇴원 일정이 잡히면 그때 움직이는 게 낫다.",
      "다만 사고나 급작스러운 퇴원처럼 시급한 상황에서는 긴급 지원 경로가 열려 있을 수 있다.",
      "소요 기간은 지자체 인력 상황에 따라 차이가 크다. 문의할 때 예상 기간을 반드시 같이 물어볼 것.",
    ],
  },
  {
    id: "m5",
    myth: "전국 어디나 똑같이 돌아간다",
    truth: "지역별 편차가 아직 크다",
    level: "no",
    body: [
      "시행 직전 기준으로 관련 조례를 만든 지자체가 183곳 중 20곳, 전담 센터를 설치한 곳이 15곳 수준이었다.",
      "정부가 지역 격차를 줄이려고 성과 기반 예산 차등 지원을 도입했다는 건, 뒤집으면 지금 편차가 크다는 뜻이다.",
      "그래서 '인터넷에서 본 설명'과 '부모님 동네 실제 답변'이 다를 수 있다.",
      "★ 이 글을 포함해 어떤 온라인 정보도 최종 근거가 될 수 없다. 반드시 부모님 주소지 창구에서 확인할 것.",
    ],
  },
];

// ── 문의 전 체크리스트 ───────────────────────────────────────
const CHECKLIST = [
  ["부모님 주소지 확인", "문의 창구는 자녀 주소가 아니라 부모님 주소 기준이다"],
  ["현재 받고 있는 서비스 정리", "장기요양 등급 유무, 노인맞춤돌봄 등 기존 지원 내역"],
  ["일상생활 어려움을 구체적으로 메모", "식사·이동·목욕·복약 중 무엇이 어려운지. 추상적 표현보다 구체 사례"],
  ["최근 입원·퇴원 이력", "퇴원 환자는 제도의 핵심 대상이다. 날짜와 병원명 정리"],
  ["물어볼 것 미리 적기", "대상 여부 · 예상 소요 기간 · 기존 서비스와 중복 여부 · 필요 서류"],
];

// ── 한계점 ───────────────────────────────────────────────────
const LIMITS = [
  { ic: <AlertTriangle size={18} color="#be123c" />, t: "제도가 아직 초기다", d: "2026년 3월 시행이라 세부 기준이 조정되는 중이고, 지자체 판단이 개입한다. 오늘 맞는 설명이 반년 뒤에 달라질 수 있다." },
  { ic: <XCircle size={18} color="#be123c" />, t: "모르는 사람이 여전히 많다", d: "2026년 6월 조사에서 국민 42.9%가 시행 사실을 몰랐다. 창구 담당자도 지역에 따라 안내 편차가 있을 수 있어 한 번에 끝난다고 기대하지 말 것." },
  { ic: <Clock size={18} color="#b45309" />, t: "서비스가 다 갖춰진 상태는 아니다", d: "2026~27년은 30종 서비스 정착 단계다. 방문재활·병원동행 같은 항목은 2028년 이후 본격 도입 예정." },
  { ic: <FileCheck size={18} color="#1d4ed8" />, t: "이 글은 제도 절차 정리다", d: "건강 상태에 대한 진단·처방·치료 안내가 아니다. 의학적 판단이 필요한 부분은 반드시 의료진과 상의할 것." },
];

// ── 컴포넌트 ─────────────────────────────────────────────────
function Chip({ status, text }) {
  const s = ST[status] || ST.unknown;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, fontWeight: 800,
      color: s.c, background: s.bg, border: `1.5px solid ${B.ink}`, borderRadius: 999,
      padding: "3px 9px", whiteSpace: "nowrap",
    }}>
      <span style={{ width: 7, height: 7, borderRadius: 999, background: s.dot }} />
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
        <div style={{ fontSize: 20, color: B.ink, lineHeight: 1.1, letterSpacing: -0.3, ...D }}>{title}</div>
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
export default function IntegratedCareFactCheck() {
  const [open, setOpen] = useState("m1");
  const [checked, setChecked] = useState({});
  const font = { fontFamily: FONT_BODY };
  const doneCount = CHECKLIST.filter((_, i) => checked[i]).length;

  return (
    <>
    <style>{`@import url("https://cdn.jsdelivr.net/gh/eunchurn/NanumSquareNeo@0.0.6/nanumsquareneo.css");`}</style>
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #fdfcf7 0%, #f5f1e8 45%, #ebe4d3 100%)",
      padding: "28px 16px 56px", ...font,
    }}>
      <div style={{ maxWidth: 880, margin: "0 auto" }}>

        {/* ── 헤더 ── */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
            <span style={{
              display: "inline-block", fontSize: 12, color: B.ink, ...D,
              background: "#fde68a", border: `2px solid ${B.ink}`, borderRadius: 999,
              padding: "4px 12px", boxShadow: B.shadowSm,
            }}>🧓 노후준비 #002</span>
            <span style={{
              display: "inline-block", fontSize: 12, color: "#047857", ...D,
              background: "#d1fae5", border: `2px solid ${B.ink}`, borderRadius: 999,
              padding: "4px 12px", boxShadow: B.shadowSm,
            }}>📅 확인일 2026-09-11</span>
          </div>
          <h1 style={{ fontSize: 33, color: B.ink, margin: "0 0 4px", lineHeight: 1.07, letterSpacing: -1, ...D }}>
            통합돌봄 오해 5가지
          </h1>
          <h2 style={{ fontSize: 19, color: B.sub, margin: 0, lineHeight: 1.2, ...D }}>
            2026년 바뀐 부모님 돌봄, 자녀가 대신 확인할 진짜
          </h2>
        </div>

        {/* ── 주의 배너 ── */}
        <div style={{
          background: "#fef3c7", border: `2px solid ${B.ink}`, borderRadius: 12,
          boxShadow: B.shadowSm, padding: "11px 14px", marginBottom: 20,
          fontSize: 12.5, fontWeight: 700, color: "#b45309", lineHeight: 1.55,
        }}>
          ⚠️ 이 글은 제도 절차를 정리한 기록이다. 건강 상태에 대한 진단·처방·치료 안내가 아니며,
          특정 기관·상품 추천도 아니다. 최종 확인은 부모님 주소지 읍·면·동 행정복지센터에서.
        </div>

        {/* ── 한 줄 결론 ── */}
        <div style={{
          background: B.ink, color: "#fdfcf7", border: `2px solid ${B.ink}`, borderRadius: 14,
          boxShadow: B.shadow, padding: 18, marginBottom: 26,
        }}>
          <div style={{ fontSize: 13, color: "#fbbf24", marginBottom: 7, ...D }}>📌 결론 먼저</div>
          <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.75 }}>
            부모님 돌봄 제도가 <b style={{ color: "#6ee7b7" }}>2026년 3월 27일부터 전국에서 바뀌었다.</b>{" "}
            흩어져 있던 의료·요양·돌봄을 한 번 신청으로 묶어준다.
            그런데 2026년 6월 조사에서 <b style={{ color: "#fbbf24" }}>국민 42.9%가 시행 사실조차 몰랐다.</b>{" "}
            가장 많이 걸리는 오해는 <b style={{ color: "#6ee7b7" }}>"장기요양 등급이 없으면 해당 없다"</b>는 것 —{" "}
            등급이 없어도 대상이 될 수 있다.{" "}
            <b style={{ color: "#fda4af" }}>단, 지역별 편차가 아직 크다. 온라인 정보로 판단하지 말고 창구에서 확인할 것.</b>
          </div>
        </div>

        {/* ── 01 30초 요약 ── */}
        <div style={{ marginBottom: 30 }}>
          <SectionTitle no="01" title="30초 요약" sub="바쁘면 여기까지만 읽어도 됨" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 12 }}>
            {QUICK.map((x, i) => (
              <Card key={i} style={{ padding: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 13.5, fontWeight: 800, color: B.ink }}>{x.t}</span>
                  <span style={{ marginLeft: "auto" }}><Chip status={x.s} /></span>
                </div>
                <div style={{ fontSize: 22, color: B.ink, marginBottom: 6, letterSpacing: -0.5, ...D }}>{x.v}</div>
                <div style={{ fontSize: 12.5, color: B.sub, fontWeight: 600, lineHeight: 1.55 }}>{x.d}</div>
              </Card>
            ))}
          </div>
        </div>

        {/* ── 02 오해 5가지 ── */}
        <div style={{ marginBottom: 30 }}>
          <SectionTitle no="02" title="오해 5가지" sub="탭해서 펼치기 — ✗ 오해 / ✓ 사실" />
          {MYTHS.map((m, idx) => {
            const isOpen = open === m.id;
            const s = ST[m.level];
            return (
              <div key={m.id} style={{
                background: B.card, border: `2px solid ${B.ink}`, borderRadius: 14,
                boxShadow: isOpen ? B.shadow : B.shadowSm, marginBottom: 10, overflow: "hidden",
              }}>
                <button
                  onClick={() => setOpen(isOpen ? null : m.id)}
                  style={{
                    width: "100%", display: "flex", alignItems: "flex-start", gap: 11,
                    background: "transparent", border: "none", padding: "14px 16px",
                    cursor: "pointer", textAlign: "left", ...font,
                  }}
                >
                  <span style={{
                    minWidth: 26, height: 26, flexShrink: 0, borderRadius: 8, background: "#fde68a",
                    border: `2px solid ${B.ink}`, display: "flex", alignItems: "center",
                    justifyContent: "center", fontWeight: 900, fontSize: 12.5, marginTop: 1,
                  }}>{idx + 1}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 13.5, fontWeight: 700, color: "#be123c",
                      textDecoration: "line-through", textDecorationThickness: 2, lineHeight: 1.4,
                    }}>✗ {m.myth}</div>
                    <div style={{ fontSize: 14.5, color: B.ink, marginTop: 4, lineHeight: 1.35, ...D }}>
                      ✓ {m.truth}
                    </div>
                  </div>
                  <span style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0, marginTop: 2 }}>
                    <Chip status={m.level} />
                    {isOpen ? <ChevronDown size={17} /> : <ChevronRight size={17} />}
                  </span>
                </button>
                {isOpen && (
                  <div style={{ padding: "13px 16px 15px", borderTop: "1.5px dashed #d6ccb5" }}>
                    {m.body.map((line, i) => (
                      <div key={i} style={{
                        display: "flex", gap: 8, fontSize: 13.5, color: B.ink,
                        fontWeight: 600, lineHeight: 1.65, marginBottom: 7,
                      }}>
                        <span style={{ color: "#d97706", fontWeight: 900, flexShrink: 0 }}>▸</span>
                        <span>{line}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── 03 문의 전 체크리스트 ── */}
        <div style={{ marginBottom: 30 }}>
          <SectionTitle no="03" title="문의 전 체크리스트" sub={`탭해서 체크 — ${doneCount}/${CHECKLIST.length} 준비됨`} />
          <Card>
            {CHECKLIST.map(([t, d], i) => {
              const on = !!checked[i];
              return (
                <div
                  key={i}
                  onClick={() => setChecked((p) => ({ ...p, [i]: !p[i] }))}
                  style={{
                    display: "flex", gap: 12, padding: "11px 0", cursor: "pointer",
                    borderBottom: i < CHECKLIST.length - 1 ? "1.5px dashed #d6ccb5" : "none",
                    opacity: on ? 0.5 : 1,
                  }}
                >
                  <span style={{
                    width: 26, height: 26, flexShrink: 0, borderRadius: 8,
                    background: on ? "#d1fae5" : "#fffdf8", border: `2px solid ${B.ink}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 900, fontSize: 13,
                  }}>{on ? "✓" : ""}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: 14, fontWeight: 800, color: B.ink,
                      textDecoration: on ? "line-through" : "none",
                    }}>{t}</div>
                    <div style={{ fontSize: 12.5, color: B.sub, fontWeight: 600, marginTop: 2, lineHeight: 1.5 }}>{d}</div>
                  </div>
                </div>
              );
            })}
          </Card>
        </div>

        {/* ── 04 어디에 물어보나 ── */}
        <div style={{ marginBottom: 30 }}>
          <SectionTitle no="04" title="어디에 물어보나" sub="창구는 두 곳" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 12 }}>
            <Card style={{ padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Home size={18} /><span style={{ fontSize: 14.5, fontWeight: 900, color: B.ink }}>읍·면·동 행정복지센터</span>
              </div>
              <div style={{ fontSize: 13, color: B.sub, fontWeight: 600, lineHeight: 1.6 }}>
                부모님 <b style={{ color: B.ink }}>주소지 기준</b>. 자녀 주소가 아니다.
                통합돌봄 담당자를 찾아 연결해달라고 요청하면 된다.
              </div>
            </Card>
            <Card style={{ padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Phone size={18} /><span style={{ fontSize: 14.5, fontWeight: 900, color: B.ink }}>국민건강보험공단 지사</span>
              </div>
              <div style={{ fontSize: 13, color: B.sub, fontWeight: 600, lineHeight: 1.6 }}>
                장기요양 관련 이력이 있다면 이쪽이 빠를 수 있다.
                기존 등급·서비스 내역을 같이 확인하기 좋다.
              </div>
            </Card>
          </div>
        </div>

        {/* ── 05 냉정한 한계점 ── */}
        <div style={{ marginBottom: 30 }}>
          <SectionTitle no="05" title="냉정한 한계점" sub="기대치를 먼저 맞추고 시작할 것" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 12 }}>
            {LIMITS.map((x, i) => (
              <Card key={i} style={{ padding: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
                  {x.ic}<span style={{ fontSize: 14, fontWeight: 900, color: B.ink }}>{x.t}</span>
                </div>
                <div style={{ fontSize: 12.5, color: B.sub, fontWeight: 600, lineHeight: 1.55 }}>{x.d}</div>
              </Card>
            ))}
          </div>
        </div>

        {/* ── 출처 ── */}
        <Card style={{ padding: 14, background: "#f5f1e8" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
            <Scale size={16} /><span style={{ fontSize: 13, fontWeight: 900, color: B.ink }}>출처 · 확인일 2026-09-11</span>
          </div>
          <div style={{ fontSize: 11.5, color: B.sub, fontWeight: 600, lineHeight: 1.75 }}>
            「의료·요양 등 지역 돌봄의 통합지원에 관한 법률」(2024-03-26 제정, 2026-03-27 시행) ·
            보건복지부 시행령·시행규칙 공포 보도자료(2025-12-09) ·
            보건복지부·국민건강보험공단 통합돌봄 인지도 조사(2026-06-15~19) ·
            한겨레 2022-09-15 「따로 노는 복지서비스…"의료·장기요양 통합 지원 필요"」
            <br />
            <b style={{ color: "#be123c" }}>
              ※ 제도 시행 초기라 세부 기준이 조정될 수 있고 지자체 판단이 개입한다.
              이 글은 참고용이며, 최종 확인은 부모님 주소지 읍·면·동 행정복지센터 또는 국민건강보험공단 지사에서.
            </b>
          </div>
        </Card>

        <div style={{ textAlign: "center", fontSize: 11.5, color: "#a8a29e", fontWeight: 700, marginTop: 28 }}>
          🧓 노후준비 #002 · 통합돌봄 팩트체크 · made by 환희
        </div>
      </div>
    </div>
    </>
  );
}
