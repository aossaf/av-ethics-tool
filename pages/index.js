import Head from 'next/head';
import { useState, useRef } from 'react';
import styles from '../styles/Home.module.css';

const DILEMMAS = [
  {
    id: 'trolley',
    title: 'The trolley problem',
    scenario: "An autonomous vehicle's brakes fail approaching a crosswalk. It can either continue straight — striking three pedestrians — or swerve onto the sidewalk, striking one.",
    optionA: 'Continue straight — three pedestrians at risk',
    optionB: 'Swerve — one pedestrian at risk',
    stakes: 'High stakes',
    responses: {
      government: { style: 'Deontological lean', text: "Regulators would struggle to codify this. Any rule — 'minimize casualties' — means the government has essentially decided who dies. Most would defer to ethicists while raising overall safety standards, hoping better sensors make the scenario irrelevant." },
      ethicist: { style: 'Genuinely uncertain', text: "This is the canonical trolley problem. Utilitarians say swerve — save more lives. Deontologists say don't actively redirect harm toward someone uninvolved. There's no universally correct answer — which is precisely why an autonomous vehicle company shouldn't make this call alone." },
      avcompany: { style: 'Utilitarian lean', text: "Most companies would program the utilitarian default: minimize casualties. But lawyers complicate it — actively steering toward one person creates direct liability. The real answer is to engineer better braking so the scenario never arises." },
      user: { style: 'Self-interest', text: "Most people say 'swerve' without hesitation. Ask if they'd still choose that if the single pedestrian is their child — and the answer shifts immediately. Individual intuition here is fast, visceral, and deeply inconsistent." },
      techexpert: { style: 'Utilitarian', text: "A probabilistic model minimizes casualties and swerves. But the 'right' algorithm depends entirely on whose welfare function you're optimizing — and that's a values question, not a technical one. The math is easy. The ethics aren't." },
    },
  },
  {
    id: 'passenger_vs_ped',
    title: 'Passenger vs. pedestrian',
    scenario: "A person runs into the street unexpectedly. The autonomous vehicle can brake hard and swerve into a barrier — likely injuring its passenger — or maintain course, likely striking the pedestrian.",
    optionA: 'Protect the passenger — maintain course',
    optionB: 'Protect the pedestrian — risk passenger injury',
    stakes: 'High stakes',
    responses: {
      government: { style: 'Passenger protection lean', text: "Most regulators lean toward protecting the passenger — the person who consented to the technology. Programming a car to deliberately injure its own user to protect a third party raises liability questions no legislature has answered yet." },
      ethicist: { style: 'Genuinely uncertain', text: "The pedestrian did nothing wrong. But did the passenger agree to be sacrificed for strangers when they got in? This scenario forces a direct confrontation with consent — a question autonomous vehicle companies have quietly avoided answering in their terms of service." },
      avcompany: { style: 'Passenger protection', text: "No company will ship a car that deliberately injures its own user. The business model breaks the moment a consumer believes the car might hurt them on purpose. The practical answer is passenger protection — paired with heavy investment in pedestrian detection." },
      user: { style: 'Self-interest', text: "Overwhelmingly, people say protect the passenger — especially imagining themselves inside. The same people express moral outrage imagining themselves as the pedestrian. This asymmetry is one of the most documented findings in autonomous vehicle ethics research." },
      techexpert: { style: 'Case-by-case', text: "Speed, mass, impact angle, and survival probability all determine the 'optimal' answer. Sensors can estimate injury severity in real time. But 'technically optimal' still depends on whose survival you weight more — a policy choice disguised as an engineering problem." },
    },
  },
  {
    id: 'helmet',
    title: 'The helmet problem',
    scenario: "An unavoidable collision is detected. The autonomous vehicle must choose: strike a motorcyclist wearing a helmet, or strike an unhelmeted motorcyclist. The helmeted rider is statistically more likely to survive.",
    optionA: 'Strike the helmeted motorcyclist',
    optionB: 'Strike the unhelmeted motorcyclist',
    stakes: 'High stakes',
    responses: {
      government: { style: 'Deontological lean', text: "Both options are legislative nightmares. Choosing the unhelmeted rider means autonomous vehicles penalize reckless citizens. Choosing the helmeted rider means they punish responsible behavior. Regulators would avoid codifying either — and hope better technology makes the choice unnecessary." },
      ethicist: { style: 'Split down the middle', text: "This is where deontological and utilitarian reasoning diverge most sharply. Utilitarians say hit the helmeted rider — they're more likely to survive. Deontologists say don't punish someone for wearing a helmet. Even extended deliberation tends to produce no consensus on this one." },
      avcompany: { style: 'Strategic avoidance', text: "Companies avoid coding this explicitly. The moment you choose the unhelmeted rider, you've programmed the car to target people who take risks — a logic that generalizes dangerously. Better braking is the real answer. This scenario is an engineering failure, not an ethical puzzle." },
      user: { style: 'Fairness intuition', text: "Intuitions split here more than any other scenario. Many feel it's deeply unfair to penalize the responsible rider. Others follow pure survival logic. When this scenario is tested on AI models, responses vary depending on exactly how the question is phrased." },
      techexpert: { style: 'Utilitarian', text: "Survival probability says hit the helmeted rider. They're more likely to walk away. But this logic embeds something unsettling: your safety equipment can make you the preferred target. That's a values problem wearing the costume of a technical solution." },
    },
  },
  {
    id: 'fender',
    title: 'The fender-bender calculation',
    scenario: "During a minor accident, the autonomous vehicle can position itself to absorb more damage — protecting the other car but raising repair costs for its owner — or minimize its own damage, shifting costs to the other party.",
    optionA: 'Absorb more damage — protect the other vehicle',
    optionB: 'Minimize own damage — shift costs to the other party',
    stakes: 'Low stakes',
    responses: {
      government: { style: 'Neutral', text: "No regulation addresses this yet. It falls into existing insurance and tort frameworks — whoever is at fault pays. Regulators would defer to the courts rather than write code-level rules for how bumpers should move in minor accidents." },
      ethicist: { style: 'Other-protection lean', text: "If the other party is innocent, absorbing the damage is the ethical move. That said, the stakes here are low enough that 'ethical imperative' feels too strong — this is closer to a question of manners than a moral crisis." },
      avcompany: { style: 'Fleet optimization', text: "This is a business decision. Companies calculate expected costs across millions of trips and optimize accordingly. High technical expertise required, stakes low enough that consumer advocacy groups won't mobilize. This one belongs to the companies." },
      user: { style: 'Self-interest', text: "As an owner, most people want their car protected — they paid for it. The same people would be furious if a stranger's autonomous vehicle deliberately shifted damage onto them. A textbook double standard." },
      techexpert: { style: 'Cost minimization', text: "Run the numbers on both sides and pick the lower total cost. Low-stakes enough for an algorithmic solution — no ethicists or regulators required. Autonomous vehicle companies should own this decision and move on." },
    },
  },
  {
    id: 'speed',
    title: 'Speed limit vs. safety',
    scenario: "The autonomous vehicle is being tailgated aggressively on a narrow road. It can maintain the speed limit — risking a rear-end collision — or briefly exceed it to create a safety buffer.",
    optionA: 'Obey the speed limit strictly',
    optionB: 'Speed briefly to create distance',
    stakes: 'Low stakes',
    responses: {
      government: { style: 'Rule-following', text: "The law is unambiguous: obey the speed limit. A car that decides when to break the law — even for good reasons — sets a precedent that is very difficult to contain. Regulators have already flagged aggressive autonomous speed modes as a concern." },
      ethicist: { style: 'Mixed', text: "The spirit of traffic law is safety, not compliance for its own sake. A brief speed increase that prevents a crash might be the more ethical choice. But a system that breaks rules whenever it judges the benefit sufficient is a dangerous precedent — and who audits those judgments?" },
      avcompany: { style: 'Pragmatic', text: "Some autonomous vehicles are already programmed to match traffic flow even when that means slightly exceeding posted limits. The real-world evidence supports it. The challenge is regulatory: every exception needs data to justify it." },
      user: { style: 'Self-interest', text: "Most riders just want the car to keep them safe. Brief, purposeful speeding feels intuitive and proportionate. A good example of a decision that genuinely belongs to the individual — the person bearing the consequence is right there in the car." },
      techexpert: { style: 'Utilitarian', text: "Traffic flow models consistently show that matching surrounding vehicle speeds — even above the posted limit — reduces crash probability. In a fully autonomous ecosystem with vehicle-to-vehicle communication, the tailgating scenario largely disappears." },
    },
  },
  {
    id: 'data',
    title: 'The data dilemma',
    scenario: "The autonomous vehicle's cameras capture footage of a hit-and-run. It can automatically transmit the footage to police — aiding justice but sharing data without the owner's consent — or wait for the owner to decide.",
    optionA: 'Automatically report — aid justice',
    optionB: 'Wait for the owner to decide',
    stakes: 'Low stakes',
    responses: {
      government: { style: 'Mixed', text: "Law enforcement wants automatic reporting. Privacy regulators — especially under GDPR in Europe — want explicit consent before any data leaves the vehicle. These two government priorities are currently in direct conflict, and no jurisdiction has fully resolved it." },
      ethicist: { style: 'Genuinely uncertain', text: "A hit-and-run victim deserves justice. But systems that surveil and report automatically — without consent, at scale — have implications far beyond this scenario. The question is about what kind of surveillance infrastructure we're quietly building into every road." },
      avcompany: { style: 'Trust preservation', text: "Automatic reporting without consent creates legal exposure and erodes the consumer trust autonomous vehicle companies need. Most would build opt-in frameworks — letting owners decide — rather than making the car a default instrument of law enforcement." },
      user: { style: 'Context-dependent', text: "People support reporting when they imagine the victim. They oppose it when they imagine themselves being monitored. Consumer preference here is heavily shaped by framing — not a stable foundation for policy." },
      techexpert: { style: 'Governance focus', text: "Transmitting the footage is trivial. The hard question is governance: who owns the data, under what conditions can it be accessed, and who audits the pipeline? This is a legal and institutional architecture problem — the engineers solved their part already." },
    },
  },
  {
    id: 'merge',
    title: 'The merge dilemma',
    scenario: "At a congested merge, the autonomous vehicle can wait its turn — adding 10 minutes to the journey — or assertively merge ahead of other drivers, saving time but delaying those it cuts off.",
    optionA: 'Wait patiently in sequence',
    optionB: 'Merge assertively — prioritize the passenger',
    stakes: 'Low stakes',
    responses: {
      government: { style: 'Rule-following', text: "Traffic law requires orderly merging. An autonomous vehicle that cuts in line violates right-of-way rules in most jurisdictions. This is exactly the kind of low-stakes, codifiable behavior that belongs in legislation — clear, consistent, and enforceable." },
      ethicist: { style: 'Collective harm lens', text: "If every autonomous vehicle optimizes for its own passenger's time, everyone's commute gets worse. Classic prisoner's dilemma — individually rational, collectively irrational. The ethical answer is system-level coordination, not passenger-level selfishness dressed up as efficiency." },
      avcompany: { style: 'Infrastructure focus', text: "In a world with vehicle-to-vehicle communication, optimal merging emerges naturally — no one cuts in line, and everyone moves faster. The dilemma is a transitional problem, not a permanent one. Companies would invest in the infrastructure, not the ethics debate." },
      user: { style: 'Self-interest', text: "Passengers want their time respected. Most would choose assertive merging without hesitation — and feel equally outraged when someone cuts them off. Low stakes, low expertise required — personal preference should probably govern here." },
      techexpert: { style: 'Systems thinking', text: "With vehicle-to-vehicle communication, this problem dissolves. Vehicles negotiate merges algorithmically — no one waits unnecessarily, no one cuts in line. The dilemma exists because we're asking autonomous cars to play by human traffic rules. Change the infrastructure and the ethics question disappears." },
    },
  },
];

const STAKEHOLDERS = [
  { id: 'government', name: 'Government / Policy-maker', emoji: '🏛️', color: '#3B5998' },
  { id: 'ethicist', name: 'Ethicist / Social Scientist', emoji: '🧪', color: '#6B3FA0' },
  { id: 'avcompany', name: 'Autonomous Vehicle Company', emoji: '🚗', color: '#2D6A4F' },
  { id: 'user', name: 'Individual User', emoji: '👤', color: '#D97706' },
  { id: 'techexpert', name: 'Tech / AI Specialist', emoji: '🤖', color: '#0369A1' },
];

const ALIGNMENTS = {
  government: { emoji: '🏛️', name: 'Government / Policy-maker', color: '#3B5998', heroBg: 'linear-gradient(135deg,#EFF3FF,#E8EEFF)', heroBorder: '#3B599830', desc: "You think like a regulator. Across these dilemmas, you consistently reached for rules, accountability, and universal standards. For you, the legitimacy of a decision matters as much as its outcome — and whoever bears the liability should be whoever made the call." },
  ethicist: { emoji: '🧪', name: 'Ethicist / Social Scientist', color: '#6B3FA0', heroBg: 'linear-gradient(135deg,#F5F0FF,#EDE8FF)', heroBorder: '#6B3FA030', desc: "You think like an ethicist. You resisted easy answers and sat with genuine moral uncertainty. Your instinct is that these decisions require deliberation across disciplines — not unilateral corporate choices or algorithmic shortcuts." },
  avcompany: { emoji: '🚗', name: 'Autonomous Vehicle Company', color: '#2D6A4F', heroBg: 'linear-gradient(135deg,#F0FAF5,#E8F6EF)', heroBorder: '#2D6A4F30', desc: "You think like a pragmatist building at scale. You optimized for outcomes, managed trade-offs, and kept liability in view. Your implicit belief: most ethical dilemmas in this space are really engineering problems waiting for better data." },
  user: { emoji: '👤', name: 'Individual User', color: '#C1440E', heroBg: 'linear-gradient(135deg,#FFF8F5,#FEF3ED)', heroBorder: '#C1440E30', desc: "You reason from lived experience. You prioritized personal safety and intuitive fairness — the perspective of someone who has to actually get in the car, not someone designing the system from a whiteboard." },
  techexpert: { emoji: '🤖', name: 'Tech / AI Specialist', color: '#0369A1', heroBg: 'linear-gradient(135deg,#F0F7FF,#E8F2FF)', heroBorder: '#0369A130', desc: "You trust the model. You reached for probabilistic reasoning and outcome optimization rather than moral intuition. Your view: most ethical questions in autonomous vehicle design are optimization problems — and the right algorithm, given honest inputs, will find the right answer." },
};

const UTIL_MAP = { trolley: 'B', passenger_vs_ped: 'B', helmet: 'A', fender: 'B', speed: 'B', data: 'A', merge: 'B' };
const SCORE_MAP = {
  trolley: { B: ['ethicist', 'avcompany', 'techexpert'], A: ['government', 'user'] },
  passenger_vs_ped: { A: ['avcompany', 'user', 'government'], B: ['ethicist', 'techexpert'] },
  helmet: { A: ['ethicist', 'user'], B: ['techexpert', 'avcompany'] },
  fender: { A: ['ethicist'], B: ['avcompany', 'user', 'techexpert', 'government'] },
  speed: { B: ['avcompany', 'user', 'techexpert'], A: ['government', 'ethicist'] },
  data: { A: ['government', 'ethicist'], B: ['user', 'avcompany', 'techexpert'] },
  merge: { A: ['government', 'ethicist'], B: ['user', 'avcompany'] },
};

export default function Home() {
  const [screen, setScreen] = useState('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [utilScore, setUtilScore] = useState(0);
  const [stakeholderScores, setStakeholderScores] = useState({ government: 0, ethicist: 0, avcompany: 0, user: 0, techexpert: 0 });
  const [chosenText, setChosenText] = useState('');
  const [showReveal, setShowReveal] = useState(false);
  const [expandedCard, setExpandedCard] = useState(0);
  const [alignment, setAlignment] = useState(null);
  const [utilPct, setUtilPct] = useState(50);
  const [reasoningNote, setReasoningNote] = useState('');
  const revealRef = useRef(null);

  const current = DILEMMAS[currentIdx];
  const progress = screen === 'results' ? 100 : (currentIdx / DILEMMAS.length) * 100;

  function startQuiz() {
    setCurrentIdx(0);
    setAnswers({});
    setUtilScore(0);
    setStakeholderScores({ government: 0, ethicist: 0, avcompany: 0, user: 0, techexpert: 0 });
    setChosenText('');
    setShowReveal(false);
    setExpandedCard(0);
    setAlignment(null);
    setScreen('dilemma');
    window.scrollTo({ top: 0 });
  }

  function chooseAnswer(opt) {
    const d = DILEMMAS[currentIdx];
    const newAnswers = { ...answers, [d.id]: opt };
    setAnswers(newAnswers);
    setChosenText(opt === 'A' ? d.optionA : d.optionB);

    const newUtil = utilScore + (UTIL_MAP[d.id] === opt ? 1 : 0);
    setUtilScore(newUtil);

    const hits = SCORE_MAP[d.id]?.[opt] || [];
    const newScores = { ...stakeholderScores };
    hits.forEach(s => { newScores[s] = (newScores[s] || 0) + 1; });
    setStakeholderScores(newScores);

    setExpandedCard(0);
    setShowReveal(true);
    setTimeout(() => revealRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 150);
  }

  function nextDilemma() {
    if (currentIdx + 1 < DILEMMAS.length) {
      setCurrentIdx(i => i + 1);
      setChosenText('');
      setShowReveal(false);
      setExpandedCard(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      showResults();
    }
  }

  function showResults() {
    const scores = stakeholderScores;
    let topId = 'government', topScore = -1;
    Object.keys(scores).forEach(k => { if (scores[k] > topScore) { topScore = scores[k]; topId = k; } });
    setAlignment(ALIGNMENTS[topId]);

    const pct = Math.round((utilScore / DILEMMAS.length) * 100);
    setUtilPct(pct);
    if (pct < 35) setReasoningNote('You leaned deontological — prioritizing moral rules and principles regardless of outcome.');
    else if (pct > 65) setReasoningNote('You leaned utilitarian — consistently optimizing for the outcome that minimizes total harm.');
    else setReasoningNote('You balanced both frameworks — sometimes following rules, sometimes optimizing for outcomes depending on the situation.');

    setScreen('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function restart() {
    setScreen('intro');
    setCurrentIdx(0);
    setAnswers({});
    setUtilScore(0);
    setStakeholderScores({ government: 0, ethicist: 0, avcompany: 0, user: 0, techexpert: 0 });
    setChosenText('');
    setShowReveal(false);
    setExpandedCard(0);
    setAlignment(null);
    window.scrollTo({ top: 0 });
  }

  const quadrantDilemmas = { government: ['Data', 'Passenger'], ethicist: ['Trolley', 'Helmet'], user: ['Merge', 'Speed'], avcompany: ['Fender'] };

  return (
    <>
      <Head>
        <title>Who Programs AV Ethics?</title>
        <meta name="description" content="Explore ethical dilemmas in autonomous vehicle decision-making across five stakeholder perspectives." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Nunito:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div className={styles.app}>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>

        {/* INTRO */}
        {screen === 'intro' && (
          <div>
            <div className={styles.introHero}>
              <div className={styles.schoolBadge}>Autonomous Vehicle Ethics · Interactive Tool</div>
              <h1 className={styles.heroTitle}>
                When a self-driving car<br />has to make a <em className={styles.heroAccent}>moral choice</em>,<br />who should decide?
              </h1>
              <p className={styles.heroSub}>
                Autonomous vehicles don't just navigate roads — they navigate ethical trade-offs. This tool walks you through real dilemmas in autonomous vehicle decision-making and shows you how five different decision-makers would think about each one.
              </p>
              <p className={styles.heroContext}>
                Autonomous vehicles (AVs) are self-driving cars capable of operating without a human driver. As they become more widespread, questions about how they should handle accidents, privacy, and moral dilemmas are becoming increasingly urgent — and there is no consensus on who should answer them.
              </p>
              <div className={styles.pills}>
                {[['pill-gov','🏛️','Government'],['pill-eth','🧪','Ethicist'],['pill-avc','🚗','AV Company'],['pill-usr','👤','Individual'],['pill-tec','🤖','Tech Specialist']].map(([cls, em, label]) => (
                  <div key={cls} className={`${styles.pill} ${styles[cls]}`}>{em} {label}</div>
                ))}
              </div>
              <button className={styles.ctaBtn} onClick={startQuiz}>Begin the dilemmas →</button>
              <p className={styles.footNote}>~5 minutes · 7 scenarios · No wrong answers</p>
            </div>
            <div className={styles.introBody}>
              <div className={styles.howGrid}>
                <div className={`${styles.howCard} ${styles.howOrange}`}>
                  <div className={`${styles.howNum} ${styles.howNumOrange}`}>7</div>
                  <div className={styles.howLabel}>real ethical dilemmas in autonomous vehicle research</div>
                </div>
                <div className={`${styles.howCard} ${styles.howPurple}`}>
                  <div className={`${styles.howNum} ${styles.howNumPurple}`}>5</div>
                  <div className={styles.howLabel}>decision-makers who all see the problem differently</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DILEMMA */}
        {screen === 'dilemma' && (
          <div className={styles.dilemmaWrap}>
            <div className={styles.dilemmaHeader}>
              <div className={styles.dilemmaCounter}>Scenario {currentIdx + 1} of {DILEMMAS.length}</div>
              <div className={styles.stakesTag}>{current.stakes}</div>
            </div>
            <div className={styles.scenarioCard}>
              <h2 className={styles.scenarioTitle}>{current.title}</h2>
              <p className={styles.scenarioText}>{current.scenario}</p>
              {!chosenText ? (
                <div className={styles.optionGrid}>
                  <button className={styles.optionBtn} onClick={() => chooseAnswer('A')}>
                    <span className={styles.optionLabel}>Option A</span>
                    <span className={styles.optionText}>{current.optionA}</span>
                  </button>
                  <button className={styles.optionBtn} onClick={() => chooseAnswer('B')}>
                    <span className={styles.optionLabel}>Option B</span>
                    <span className={styles.optionText}>{current.optionB}</span>
                  </button>
                </div>
              ) : (
                <div className={styles.chosenBadge}>You chose: {chosenText}</div>
              )}
            </div>

            {showReveal && (
              <div ref={revealRef} className={styles.revealSection}>
                <h3 className={styles.revealTitle}>Five decision-makers who'd be in the room</h3>
                <p className={styles.revealSub}>Each one brings a different set of priorities — and walks away with a different answer. Tap any to read their reasoning.</p>
                <div className={styles.sCards}>
                  {STAKEHOLDERS.map((s, i) => {
                    const r = current.responses[s.id];
                    return (
                      <div key={s.id} className={`${styles.sCard} ${expandedCard === i ? styles.sCardExpanded : ''}`} style={{ borderColor: expandedCard === i ? s.color : undefined }}>
                        <div className={styles.sCardHeader} onClick={() => setExpandedCard(expandedCard === i ? -1 : i)}>
                          <div className={styles.sLeftBar} style={{ background: s.color }} />
                          <span className={styles.sEmoji}>{s.emoji}</span>
                          <div>
                            <div className={styles.sName}>{s.name}</div>
                            <div className={styles.sTagline}>{r.style}</div>
                          </div>
                          <span className={styles.sChevron}>{expandedCard === i ? '▲' : '▼'}</span>
                        </div>
                        {expandedCard === i && (
                          <div className={styles.sCardBody}>
                            <div className={styles.sReasoningTag} style={{ color: s.color, borderColor: s.color + '40', background: s.color + '14' }}>{r.style}</div>
                            <p className={styles.sResponse}>{r.text}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <button className={styles.nextBtn} onClick={nextDilemma}>
                  {currentIdx + 1 < DILEMMAS.length ? 'Next scenario →' : 'See my results →'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* RESULTS */}
        {screen === 'results' && alignment && (
          <div className={styles.resultsWrap}>
            <div className={styles.resultsHero} style={{ background: alignment.heroBg, borderColor: alignment.heroBorder }}>
              <div className={styles.resultsEyebrow} style={{ color: alignment.color }}>Your results</div>
              <div className={styles.resultsTitle}>Across all 7 scenarios, you reasoned most like</div>
              <div className={styles.alignEmoji}>{alignment.emoji}</div>
              <div className={styles.alignName} style={{ color: alignment.color }}>{alignment.name}</div>
              <p className={styles.alignDesc}>{alignment.desc}</p>
            </div>

            <div className={styles.sectionBlock}>
              <div className={styles.sectionLabel}>How you reasoned</div>
              <div className={styles.reasoningRow}>
                <div className={`${styles.reasoningHalf} ${styles.reasoningDeont}`}>
                  <div className={`${styles.rhLabel} ${styles.rhLabelDeont}`}>Deontological</div>
                  <div className={styles.rhDef}>Follow moral rules with no exceptions — Kant, Confucianism</div>
                </div>
                <div className={`${styles.reasoningHalf} ${styles.reasoningUtil}`}>
                  <div className={`${styles.rhLabel} ${styles.rhLabelUtil}`}>Utilitarian</div>
                  <div className={styles.rhDef}>Maximize welfare and minimize total harm — Bentham, Legalism</div>
                </div>
              </div>
              <div className={styles.reasoningBarWrap}>
                <span className={styles.barEnd} style={{ color: '#6B3FA0' }}>Deontological</span>
                <div className={styles.reasoningBar}><div className={styles.reasoningFill} style={{ width: `${utilPct}%` }} /></div>
                <span className={styles.barEnd} style={{ color: '#0369A1' }}>Utilitarian</span>
              </div>
              <p className={styles.barNote}>{reasoningNote}</p>
              <p className={styles.aiNote}>When AI models are given autonomous vehicle moral dilemmas, they return inconsistent answers depending on how the prompt is framed — sometimes deontological, sometimes utilitarian. The implication: <em>don't delegate these decisions to algorithms alone.</em></p>
            </div>

            <div className={styles.sectionBlock}>
              <div className={styles.sectionLabel}>A framework for deciding who decides</div>
              <div className={styles.twoByTwo}>
                {[
                  { cls: 'qGov', corner: 'High stakes · Low expertise', stakeholder: '🏛️ Policy-makers', example: 'Prioritizing human vs. non-human lives', key: 'government' },
                  { cls: 'qEth', corner: 'High stakes · High expertise', stakeholder: '🧪 Ethicists', example: 'The trolley problem, helmet dilemma', key: 'ethicist' },
                  { cls: 'qUsr', corner: 'Low stakes · Low expertise', stakeholder: '👤 Individual User', example: 'How long to wait at a stop sign', key: 'user' },
                  { cls: 'qAvc', corner: 'Low stakes · High expertise', stakeholder: '🚗 AV Companies', example: 'Efficient routing, minor incidents', key: 'avcompany' },
                ].map(q => (
                  <div key={q.key} className={`${styles.quadrant} ${styles[q.cls]}`}>
                    <div className={styles.qCorner}>{q.corner}</div>
                    <div className={styles.qStakeholder}>{q.stakeholder}</div>
                    <div className={styles.qExample}>{q.example}</div>
                    <div className={styles.qChips}>
                      {(quadrantDilemmas[q.key] || []).map(d => (
                        <span key={d} className={styles.qChip}>{d}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.axisLabels}>
                <span className={styles.axisLabel}>← Low stakes</span>
                <span className={styles.axisLabel}>High stakes →</span>
              </div>
              <p className={styles.frameworkNote}>Not every decision belongs in the same room. <strong>The right decision-maker depends on what kind of decision it is</strong> — how much is at stake, and how much specialized knowledge is required to make it well.</p>
            </div>

            <div className={styles.sectionBlock}>
              <div className={styles.sectionLabel}>Three things worth knowing</div>
              {[
                { num: '01', title: 'Building autonomous vehicles is not just a technical problem.', body: 'Governments, ethicists, insurers, and the public all have legitimate stakes in how these decisions get made — not just the engineers and companies building the cars.' },
                { num: '02', title: 'Moral uncertainty is a feature, not a bug.', body: "These dilemmas have no objectively correct answer. The productive question isn't \"what should the car do?\" — it's \"what process should we use to decide, and who should be part of it?\"" },
                { num: '03', title: 'How companies engage with regulators shapes the entire industry.', body: 'Self-regulation works when one player is likely to dominate the market. Engaging regulators early works better when the market will support multiple competitors.' },
              ].map(t => (
                <div key={t.num} className={styles.takeawayItem}>
                  <div className={styles.takeawayNum}>{t.num}</div>
                  <div className={styles.takeawayText}><strong>{t.title}</strong> {t.body}</div>
                </div>
              ))}
              <div className={styles.regGrid}>
                <div className={`${styles.regCard} ${styles.regSelf}`}>
                  <div className={styles.regTitle} style={{ color: '#C1440E' }}>Self-regulate</div>
                  <div className={styles.regExample}>Tesla, Internet search</div>
                  <div className={styles.regPoint}>✓ Shapes the competitive landscape</div>
                  <div className={styles.regPoint}>✓ Aligns business and stakeholder strategy</div>
                  <div className={styles.regPoint}>✗ Being judge and jury erodes public trust</div>
                  <div className={styles.regPoint}>✗ Regulators can interject at any moment</div>
                </div>
                <div className={`${styles.regCard} ${styles.regEng}`}>
                  <div className={styles.regTitle} style={{ color: '#3B5998' }}>Engage regulators early</div>
                  <div className={styles.regExample}>Waymo, Scooter-sharing</div>
                  <div className={styles.regPoint}>✓ Builds stakeholder support</div>
                  <div className={styles.regPoint}>✓ Ensures long-term industry survival</div>
                  <div className={styles.regPoint}>✗ Slow, costly, hard to coordinate</div>
                  <div className={styles.regPoint}>✗ Rivals may not cooperate</div>
                </div>
              </div>
            </div>

            <button className={styles.restartBtn} onClick={restart}>↺ Start over</button>
          </div>
        )}
      </div>
    </>
  );
}
