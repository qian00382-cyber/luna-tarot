// utils/api.js — API调用 & 塔罗牌数据

const BASE = "https://ishtarcollective.blob.core.windows.net/rider-waite-tarot";

// 根据环境切换API地址
const API_BASE = process.env.NODE_ENV === 'development'
  ? 'http://localhost:3000'
  : 'https://www.taotalisman.com';

export const deck = [
  { name: "The Fool (0)", tag: "Beginnings · Freedom", meaning: "A new journey is unfolding. Stay curious and open, but don't ignore basic preparations.", img: BASE + "/major-0.jpg" },
  { name: "The Magician (I)", tag: "Action · Resources", meaning: "You already have the tools you need. Focus your intention and take the first concrete step.", img: BASE + "/major-1.jpg" },
  { name: "The High Priestess (II)", tag: "Intuition · Stillness", meaning: "The answer lies within, not outside. Slow down, observe, and let your intuition speak.", img: BASE + "/major-2.jpg" },
  { name: "The Empress (III)", tag: "Nurturing · Abundance", meaning: "Invest energy into nurturing: relationships, creativity, or your well-being. Be gentle yet steady.", img: BASE + "/major-3.jpg" },
  { name: "The Emperor (IV)", tag: "Structure · Boundaries", meaning: "Create clear plans and healthy boundaries. Stabilize the foundation before expanding.", img: BASE + "/major-4.jpg" },
  { name: "The Hierophant (V)", tag: "Tradition · Guidance", meaning: "Seek wisdom from reliable experience. Consider consulting a mentor or following proven methods.", img: BASE + "/major-5.jpg" },
  { name: "The Lovers (VI)", tag: "Choice · Alignment", meaning: "Alignment of values matters most. Ask yourself: what do I truly want? Commitment means trade-offs.", img: BASE + "/major-6.jpg" },
  { name: "The Chariot (VII)", tag: "Drive · Willpower", meaning: "Once direction is set, move forward with focus. Control your pace and don't let distractions derail you.", img: BASE + "/major-7.jpg" },
  { name: "Strength (VIII)", tag: "Gentle Power", meaning: "True strength is patient and compassionate. Guide your inner fears with calm, not suppression.", img: BASE + "/major-8.jpg" },
  { name: "The Hermit (IX)", tag: "Solitude · Reflection", meaning: "Step back and clarify what truly matters. Less noise, more honest self-dialogue.", img: BASE + "/major-9.jpg" },
  { name: "Wheel of Fortune (X)", tag: "Change · Timing", meaning: "Circumstances are shifting. Don't try to control everything — adapt and stay prepared.", img: BASE + "/major-10.jpg" },
  { name: "Justice (XI)", tag: "Balance · Fairness", meaning: "Cause and effect are at work. Make decisions based on facts and principles, not emotion.", img: BASE + "/major-11.jpg" },
  { name: "The Hanged Man (XII)", tag: "Pause · Perspective", meaning: "A temporary pause may offer a new angle. Release attachment — is there a smarter, lighter way?", img: BASE + "/major-12.jpg" },
  { name: "Death (XIII)", tag: "Endings · Rebirth", meaning: "An old chapter is closing. Instead of resisting, actively let go to make space for what's new.", img: BASE + "/major-13.jpg" },
  { name: "Temperance (XIV)", tag: "Balance · Restoration", meaning: "Take it slowly and find the right blend. Sustainable rhythm beats extremes every time.", img: BASE + "/major-14.jpg" },
  { name: "The Devil (XV)", tag: "Bondage · Desire", meaning: "Something may be keeping you stuck — habit, fear, or dependency. Reclaim your power of choice.", img: BASE + "/major-15.jpg" },
  { name: "The Tower (XVI)", tag: "Upheaval · Awakening", meaning: "An old structure is crumbling. Though uncomfortable, this is an opportunity to rebuild more authentically.", img: BASE + "/major-16.jpg" },
  { name: "The Star (XVII)", tag: "Hope · Renewal", meaning: "You are restoring confidence and direction. Keep doing what makes you feel more genuine and alive.", img: BASE + "/major-17.jpg" },
  { name: "The Moon (XVIII)", tag: "Illusion · Subconscious", meaning: "Information is incomplete; emotions may be amplified. Verify facts before drawing conclusions.", img: BASE + "/major-18.jpg" },
  { name: "The Sun (XIX)", tag: "Clarity · Success", meaning: "Things are moving toward clarity and positivity. Express, share, and collaborate — then ground results in action.", img: BASE + "/major-19.jpg" },
  { name: "Judgement (XX)", tag: "Calling · Reflection", meaning: "A moment of awakening and re-choice. Face the past honestly and make decisions closer to your true self.", img: BASE + "/major-20.jpg" },
  { name: "The World (XXI)", tag: "Completion · Integration", meaning: "A cycle is completing with success. Celebrate, integrate the lessons, and prepare for the next level.", img: BASE + "/major-21.jpg" },
  { name: "Ace of Wands", tag: "Spark · Initiative", meaning: "A burst of energy and new beginnings. Strike while the inspiration is hot.", img: BASE + "/wands-1.jpg" },
  { name: "Two of Wands", tag: "Planning · Vision", meaning: "You have more options than you think. Choose deliberately, then commit with confidence.", img: BASE + "/wands-2.jpg" },
  { name: "Three of Wands", tag: "Expansion · Foresight", meaning: "Early efforts are paying off. Broaden your perspective and look for opportunities beyond the obvious.", img: BASE + "/wands-3.jpg" },
  { name: "Four of Wands", tag: "Celebration · Stability", meaning: "A moment of achievement and joy. Acknowledge progress with the people who matter.", img: BASE + "/wands-4.jpg" },
  { name: "Five of Wands", tag: "Conflict · Competition", meaning: "Multiple ideas or agendas are clashing. Find a way to channel the energy into productive collaboration.", img: BASE + "/wands-5.jpg" },
  { name: "Six of Wands", tag: "Victory · Recognition", meaning: "Hard work is earning recognition. Own the success without arrogance, and use it as momentum.", img: BASE + "/wands-6.jpg" },
  { name: "Seven of Wands", tag: "Defense · Perseverance", meaning: "Hold your ground. Others may challenge your position, but you have every right to stand firm.", img: BASE + "/wands-7.jpg" },
  { name: "Eight of Wands", tag: "Speed · Action", meaning: "Events are moving fast. Seize the momentum — this is a window of rapid progress.", img: BASE + "/wands-8.jpg" },
  { name: "Nine of Wands", tag: "Resilience · Caution", meaning: "You've been through a lot. Rest and assess before the final push — your stamina is your strength.", img: BASE + "/wands-9.jpg" },
  { name: "Ten of Wands", tag: "Burden · Responsibility", meaning: "You may be carrying more than your share. Decide what to delegate or release.", img: BASE + "/wands-10.jpg" },
  { name: "Ace of Cups", tag: "Emotion · New Love", meaning: "An opening of the heart. Allow yourself to feel, give, and receive without guarding so tightly.", img: BASE + "/cups-1.jpg" },
  { name: "Two of Cups", tag: "Partnership · Connection", meaning: "A meaningful bond is forming or deepening. Mutual respect and honesty are the foundation.", img: BASE + "/cups-2.jpg" },
  { name: "Three of Cups", tag: "Celebration · Community", meaning: "Joy is best shared. Lean into your support network and celebrate together.", img: BASE + "/cups-3.jpg" },
  { name: "Four of Cups", tag: "Contemplation · Apathy", meaning: "You may be overlooking an opportunity right in front of you. Step out of the inner fog.", img: BASE + "/cups-4.jpg" },
  { name: "Five of Cups", tag: "Loss · Grief", meaning: "Acknowledge the loss, but don't miss what remains. Healing begins with acceptance.", img: BASE + "/cups-5.jpg" },
  { name: "Six of Cups", tag: "Nostalgia · Innocence", meaning: "Reconnect with simple joys and meaningful memories — but don't live in the past.", img: BASE + "/cups-6.jpg" },
  { name: "Seven of Cups", tag: "Choices · Illusion", meaning: "Many options, but not all are real. Ground yourself in facts before choosing.", img: BASE + "/cups-7.jpg" },
  { name: "Eight of Cups", tag: "Withdrawal · Seeking", meaning: "Something no longer fulfills you. It's okay to walk away in search of deeper meaning.", img: BASE + "/cups-8.jpg" },
  { name: "Nine of Cups", tag: "Satisfaction · Wishes", meaning: "Desires are being fulfilled. Enjoy it — and stay grateful.", img: BASE + "/cups-9.jpg" },
  { name: "Ten of Cups", tag: "Harmony · Fulfillment", meaning: "Emotional and relational harmony. Share this abundance with those you love.", img: BASE + "/cups-10.jpg" },
  { name: "Ace of Swords", tag: "Clarity · Truth", meaning: "A breakthrough in understanding. Speak and act from truth, even when uncomfortable.", img: BASE + "/swords-1.jpg" },
  { name: "Two of Swords", tag: "Stalemate · Decision", meaning: "You can't avoid this choice forever. Gather what information you can, then decide.", img: BASE + "/swords-2.jpg" },
  { name: "Three of Swords", tag: "Heartbreak · Sorrow", meaning: "Pain is part of the path. Let yourself grieve, then find the clarity that comes after.", img: BASE + "/swords-3.jpg" },
  { name: "Four of Swords", tag: "Rest · Recovery", meaning: "Pause and restore. Rushing forward without rest will cost you more in the long run.", img: BASE + "/swords-4.jpg" },
  { name: "Five of Swords", tag: "Conflict · Defeat", meaning: "Winning at all costs may leave you isolated. Consider if the battle is worth the cost.", img: BASE + "/swords-5.jpg" },
  { name: "Six of Swords", tag: "Transition · Moving On", meaning: "You're leaving difficulty behind. The journey may be quiet, but it's moving you to calmer waters.", img: BASE + "/swords-6.jpg" },
  { name: "Seven of Swords", tag: "Deception · Strategy", meaning: "Something may not be fully above board. Think strategically and verify what you've been told.", img: BASE + "/swords-7.jpg" },
  { name: "Eight of Swords", tag: "Restriction · Mindset", meaning: "You feel trapped, but the barriers may be more mental than real. One small move can shift everything.", img: BASE + "/swords-8.jpg" },
  { name: "Nine of Swords", tag: "Anxiety · Nightmares", meaning: "Your fears are louder than the facts. Practice separating what is real from what is worry.", img: BASE + "/swords-9.jpg" },
  { name: "Ten of Swords", tag: "Endings · Collapse", meaning: "Something has run its full course. As painful as it feels, this ending opens the door to real recovery.", img: BASE + "/swords-10.jpg" },
  { name: "Ace of Pentacles", tag: "Opportunity · Prosperity", meaning: "A solid new opportunity is at hand. Plant this seed with care and patience.", img: BASE + "/pents-1.jpg" },
  { name: "Two of Pentacles", tag: "Balance · Adaptability", meaning: "You're juggling multiple priorities. Find a sustainable rhythm instead of reacting to every demand.", img: BASE + "/pents-2.jpg" },
  { name: "Three of Pentacles", tag: "Teamwork · Mastery", meaning: "Collaboration and skill-building lead to results. Ask for feedback and keep refining.", img: BASE + "/pents-3.jpg" },
  { name: "Four of Pentacles", tag: "Security · Control", meaning: "Protecting what you've built is wise — but gripping too tightly limits growth. Find the balance.", img: BASE + "/pents-4.jpg" },
  { name: "Five of Pentacles", tag: "Hardship · Isolation", meaning: "Difficult times call for humility and community. You don't have to go through this alone.", img: BASE + "/pents-5.jpg" },
  { name: "Six of Pentacles", tag: "Generosity · Fairness", meaning: "Give and receive in balance. Generosity flows in cycles — both directions matter.", img: BASE + "/pents-6.jpg" },
  { name: "Seven of Pentacles", tag: "Patience · Investment", meaning: "You've invested time and effort. Stay the course — meaningful results take longer than expected.", img: BASE + "/pents-7.jpg" },
  { name: "Eight of Pentacles", tag: "Diligence · Craft", meaning: "Focus and repetition build mastery. Put in the work — excellence compounds.", img: BASE + "/pents-8.jpg" },
  { name: "Nine of Pentacles", tag: "Abundance · Independence", meaning: "You've earned this comfort through your own effort. Enjoy it and trust your competence.", img: BASE + "/pents-9.jpg" },
  { name: "Ten of Pentacles", tag: "Legacy · Wealth", meaning: "Long-term security and generational impact are within reach. Build what lasts.", img: BASE + "/pents-10.jpg" }
];

// 随机抽一张
export function pickOne(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// 抽N张不重复
export function pickUnique(count) {
  const shuffled = [...deck].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// 今日牌（按日期固定）
export function getDailyCard() {
  const today = new Date();
  const key = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) & 0xffffffff;
  return deck[Math.abs(hash) % deck.length];
}

// 塔罗解读API
export async function getTarotReading(question, card, options = {}) {
  const response = await uni.request({
    url: `${API_BASE}/api/tarot-reading`,
    method: 'POST',
    header: { 'Content-Type': 'application/json' },
    data: {
      question,
      card: { name: card.name, tag: card.tag },
      ...options
    }
  });
  if (response[0]) throw new Error('Network error');
  return response[1].data;
}

// 追问API
export async function getFollowUp(messages) {
  const response = await uni.request({
    url: `${API_BASE}/api/tarot-followup`,
    method: 'POST',
    header: { 'Content-Type': 'application/json' },
    data: { messages }
  });
  if (response[0]) throw new Error('Network error');
  return response[1].data;
}

// 本地存储工具
export const storage = {
  get(key) {
    try { return uni.getStorageSync(key); } catch { return null; }
  },
  set(key, val) {
    try { uni.setStorageSync(key, val); } catch {}
  },
  remove(key) {
    try { uni.removeStorageSync(key); } catch {}
  }
};

// 历史记录
export const history = {
  getAll() {
    try { return JSON.parse(storage.get('luna_history') || '[]'); } catch { return []; }
  },
  add(card, question, reading) {
    const items = this.getAll();
    items.unshift({
      card: card.name,
      tag: card.tag,
      question: question || '',
      reading: reading || '',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    });
    storage.set('luna_history', JSON.stringify(items.slice(0, 30)));
  },
  clear() {
    storage.remove('luna_history');
  }
};
