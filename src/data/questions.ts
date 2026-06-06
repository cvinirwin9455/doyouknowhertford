import { QuizQuestion } from '@/lib/types'

export const questions: QuizQuestion[] = [
  // === HISTORY ===
  { id: '1', question: 'Hertford Castle was originally built in which century?', options: ['9th century', '11th century', '13th century', '15th century'], correctAnswer: 1, category: 'history', difficulty: 'medium', source: 'Historic England listing (Hertford Castle)' },
  { id: '3', question: 'Hertford is the county town of Hertfordshire. When was it first recorded as such?', options: ['1066', '913 AD', '1550', '1200'], correctAnswer: 1, category: 'history', difficulty: 'hard', source: 'Victoria County History of Hertfordshire' },
  { id: '4', question: 'Which famous school was founded in Hertford in 1825?', options: ['Hertford Grammar School', "Christ's Hospital", 'Haileybury College', 'Bengeo School'], correctAnswer: 1, category: 'history', difficulty: 'hard', source: "Christ's Hospital School historical records" },
  { id: '10', question: 'Which monarch held a parliament at Hertford Castle in 1066?', options: ['William the Conqueror', 'Harold II', 'Edward the Confessor', 'Henry I'], correctAnswer: 0, category: 'history', difficulty: 'medium', source: 'English Heritage Hertford Castle historical notes' },
  { id: '18', question: 'Balls Park, a Grade I listed mansion near Hertford, was built for which family?', options: ['The Harrison family', 'The Cecil family', 'The Townshend family', 'The Spencer family'], correctAnswer: 2, category: 'history', difficulty: 'hard', source: 'Historic England listing (Balls Park)' },
  { id: '21', question: 'The Synod of Hertford in 673 AD was convened by which Archbishop?', options: ['Theodore of Tarsus', 'Augustine of Canterbury', 'Dunstan', 'Lanfranc'], correctAnswer: 0, category: 'history', difficulty: 'hard', source: 'Bede, Ecclesiastical History of the English People, Book IV' },
  { id: '22', question: 'During the English Civil War, Hertford Castle was held by which side?', options: ['Parliamentarians', 'Royalists', 'It was neutral', 'It changed hands multiple times'], correctAnswer: 0, category: 'history', difficulty: 'medium', source: 'Victoria County History of Hertfordshire, Civil War chapter' },
  { id: '23', question: 'Which King granted Hertford its first royal charter?', options: ['Henry II', 'Richard I', 'John', 'Edward I'], correctAnswer: 0, category: 'history', difficulty: 'hard', source: 'Hertford Town Council historical records' },
  { id: '24', question: 'The Bluecoat School in Hertford dates back to which century?', options: ['15th century', '16th century', '17th century', '18th century'], correctAnswer: 2, category: 'history', difficulty: 'medium', source: 'Hertfordshire Archives and Local Studies' },
  { id: '25', question: 'Hertford was once the site of a Royal Mint. In which century did it operate?', options: ['9th century', '10th century', '11th century', '12th century'], correctAnswer: 1, category: 'history', difficulty: 'hard', source: 'British Numismatic Society records' },

  // === GEOGRAPHY ===
  { id: '2', question: 'Which river runs through the centre of Hertford?', options: ['River Lea', 'River Thames', 'River Stort', 'River Colne'], correctAnswer: 0, category: 'geography', difficulty: 'easy', source: 'Ordnance Survey mapping data' },
  { id: '8', question: 'How many rivers converge in Hertford?', options: ['Two', 'Three', 'Four', 'Five'], correctAnswer: 2, category: 'geography', difficulty: 'medium', source: 'Environment Agency river basin data (Lea, Beane, Rib, Mimram)' },
  { id: '13', question: 'Hertford East and Hertford North are served by which train operators respectively?', options: ['Greater Anglia and Great Northern', 'Great Northern and Greater Anglia', 'Thameslink and Greater Anglia', 'Greater Anglia and Thameslink'], correctAnswer: 0, category: 'geography', difficulty: 'medium', source: 'National Rail station data' },
  { id: '16', question: 'The Bengeo area of Hertford is located in which direction from the town centre?', options: ['North', 'South', 'East', 'West'], correctAnswer: 0, category: 'geography', difficulty: 'easy', source: 'Ordnance Survey mapping data' },
  { id: '19', question: 'What is the approximate population of Hertford as of the 2021 census?', options: ['18,000', '21,000', '27,000', '35,000'], correctAnswer: 2, category: 'geography', difficulty: 'medium', source: 'Office for National Statistics, 2021 Census' },
  { id: '26', question: 'Which river flows through Bengeo before joining the Lea in Hertford?', options: ['River Beane', 'River Rib', 'River Mimram', 'River Ash'], correctAnswer: 0, category: 'geography', difficulty: 'medium', source: 'Environment Agency catchment data' },
  { id: '27', question: 'Hertford is approximately how many miles north of central London?', options: ['15 miles', '20 miles', '25 miles', '30 miles'], correctAnswer: 2, category: 'geography', difficulty: 'easy', source: 'Ordnance Survey distance data' },
  { id: '28', question: 'Which neighbouring town lies directly to the east of Hertford?', options: ['Ware', 'Welwyn Garden City', 'Stevenage', 'Hoddesdon'], correctAnswer: 0, category: 'geography', difficulty: 'easy', source: 'Ordnance Survey mapping data' },
  { id: '29', question: 'The A414 road connects Hertford to which town to the west?', options: ['Hatfield', 'St Albans', 'Welwyn Garden City', 'Hemel Hempstead'], correctAnswer: 0, category: 'geography', difficulty: 'medium', source: 'Highways England road network data' },
  { id: '30', question: 'Which area of Hertford is known for its Victorian terraced houses near the station?', options: ['Port Vale', 'Bengeo', 'Hartham', 'Sele Farm'], correctAnswer: 0, category: 'geography', difficulty: 'medium', source: 'East Herts Conservation Area assessment' },

  // === LANDMARKS ===
  { id: '5', question: 'What is the name of the popular open space along the River Lea in the town centre?', options: ['Hartham Common', 'Castle Park', 'Riverside Gardens', 'Lea Meadow'], correctAnswer: 0, category: 'landmarks', difficulty: 'easy', source: 'East Herts District Council parks directory' },
  { id: '7', question: 'The Hertford Theatre is located on which street?', options: ['Fore Street', 'Railway Street', 'The Wash', 'Parliament Square'], correctAnswer: 0, category: 'landmarks', difficulty: 'easy', source: 'Hertford Theatre official website' },
  { id: '9', question: "Hertford Castle's gatehouse is now used by which organisation?", options: ['English Heritage', 'Hertford Town Council', 'National Trust', 'Hertfordshire County Council'], correctAnswer: 1, category: 'landmarks', difficulty: 'medium', source: 'Hertford Town Council official website' },
  { id: '17', question: 'Which war memorial stands in Parliament Square, Hertford?', options: ['A stone cross', 'A bronze soldier statue', 'The Cenotaph', 'A granite obelisk'], correctAnswer: 0, category: 'landmarks', difficulty: 'medium', source: 'Imperial War Museums War Memorials Register' },
  { id: '31', question: 'The Hertford Museum is located on which street?', options: ['Bull Plain', 'Railway Street', 'Fore Street', 'Castle Street'], correctAnswer: 0, category: 'landmarks', difficulty: 'medium', source: 'Hertford Museum official website' },
  { id: '32', question: 'Hertford Library is housed in a building that was previously used as what?', options: ['A corn exchange', 'A church', 'A school', 'A hospital'], correctAnswer: 0, category: 'landmarks', difficulty: 'hard', source: 'Hertfordshire County Council heritage records' },
  { id: '33', question: 'The Folly, a Gothic-style building near Hertford, was originally built as what?', options: ['A gatehouse', 'A water tower', 'A chapel', 'A summerhouse'], correctAnswer: 3, category: 'landmarks', difficulty: 'hard', source: 'Historic England listing records' },
  { id: '34', question: 'Which park in Hertford contains an outdoor swimming pool (lido)?', options: ['Hartham Common', 'Castle Park', 'Balls Park', 'Pinehurst'], correctAnswer: 0, category: 'landmarks', difficulty: 'easy', source: 'East Herts District Council leisure facilities' },

  // === FOOD & DRINK ===
  { id: '6', question: 'Which brewing company had a major brewery in Hertford for over 200 years?', options: ['Greene King', "Fuller's", "McMullen's", 'Whitbread'], correctAnswer: 2, category: 'food-drink', difficulty: 'easy', source: "McMullen & Sons Ltd official company history" },
  { id: '12', question: 'The historic coaching inn, The Salisbury Arms, is on which street?', options: ['Old Cross', 'Bull Plain', 'Fore Street', 'St Andrew Street'], correctAnswer: 2, category: 'food-drink', difficulty: 'medium', source: 'Hertford Town heritage trail guide' },
  { id: '35', question: "McMullen's Brewery was founded in which year?", options: ['1727', '1827', '1857', '1891'], correctAnswer: 1, category: 'food-drink', difficulty: 'medium', source: "McMullen & Sons Ltd official company history" },
  { id: '36', question: 'Which Hertford pub is located directly next to the River Lea near Folly Island?', options: ['The Old Barge', 'The Salisbury Arms', 'The White Horse', 'The Blackbirds'], correctAnswer: 0, category: 'food-drink', difficulty: 'easy', source: 'East Herts District Council licensed premises register' },
  { id: '37', question: "What is the name of McMullen's best-known cask ale?", options: ['AK Original', 'Country Best', 'Hertford Gold', 'Stronghart'], correctAnswer: 3, category: 'food-drink', difficulty: 'medium', source: "McMullen & Sons official beer list" },
  { id: '38', question: 'The Hertford Food & Drink Festival typically takes place in which month?', options: ['May', 'June', 'September', 'October'], correctAnswer: 2, category: 'food-drink', difficulty: 'medium', source: 'Hertford Civic Society events calendar' },

  // === PEOPLE ===
  { id: '14', question: 'Which famous diarist mentions visiting Hertford in the 17th century?', options: ['Samuel Pepys', 'John Evelyn', 'Daniel Defoe', 'James Boswell'], correctAnswer: 0, category: 'people', difficulty: 'hard', source: 'The Diary of Samuel Pepys, 1667 entries' },
  { id: '39', question: 'Captain WE Johns, creator of Biggles, lived in which area near Hertford?', options: ['Bengeo', 'Hertford Heath', 'Ware', 'Bayford'], correctAnswer: 1, category: 'people', difficulty: 'hard', source: 'Hertfordshire Archives biographical records' },
  { id: '40', question: 'Which Tudor queen spent part of her childhood at Hertford Castle?', options: ['Elizabeth I', 'Mary I', 'Anne Boleyn', 'Catherine Parr'], correctAnswer: 0, category: 'people', difficulty: 'medium', source: 'Royal Palaces historical archives' },
  { id: '41', question: 'Alfred Russel Wallace, co-discoverer of natural selection, was born where near Hertford?', options: ['Usk', 'Kempston', 'Hertford itself', 'Ware'], correctAnswer: 0, category: 'people', difficulty: 'hard', source: 'Natural History Museum biographical records' },

  // === CULTURE ===
  { id: '15', question: 'What is the Hertford town coat of arms known to depict?', options: ['A castle and a hart', 'A hart crossing a ford', 'Two lions and a shield', 'A river and a crown'], correctAnswer: 1, category: 'culture', difficulty: 'medium', source: 'Hertford Town Council civic heraldry records' },
  { id: '42', question: "The name 'Hertford' is derived from Old English meaning what?", options: ['Hart ford (deer crossing)', 'Herd ford (cattle crossing)', 'High ford', 'Heart ford'], correctAnswer: 0, category: 'culture', difficulty: 'easy', source: 'Oxford Dictionary of English Place-Names' },
  { id: '43', question: 'What animal features prominently in Hertford town branding?', options: ['A hart (male deer)', 'A lion', 'A swan', 'An eagle'], correctAnswer: 0, category: 'culture', difficulty: 'easy', source: 'Hertford Town Council civic identity guidelines' },
  { id: '44', question: 'Hertford has been twinned with which French town?', options: ['Evron', 'Bayeux', 'Dieppe', 'Calais'], correctAnswer: 0, category: 'culture', difficulty: 'hard', source: 'Hertford Town Council twinning records' },

  // === EVENTS ===
  { id: '11', question: 'What is the name of the annual event held at Hertford Castle each summer?', options: ['Hertford Festival', 'Castle Carnival', 'Heritage Open Day', 'The Hertford Fair'], correctAnswer: 0, category: 'events', difficulty: 'easy', source: 'Hertford Civic Society events calendar' },
  { id: '20', question: 'Which well-known market takes place in Hertford on Saturdays?', options: ['Hertford Farmers Market', 'The Charter Market', 'Castle Market', 'Old Cross Market'], correctAnswer: 1, category: 'events', difficulty: 'easy', source: 'East Herts District Council markets page' },
  { id: '45', question: 'The Hertford Christmas lights switch-on traditionally takes place in which location?', options: ['Parliament Square', 'Fore Street', 'Castle grounds', 'Bull Plain'], correctAnswer: 0, category: 'events', difficulty: 'easy', source: 'Hertford Town Council events schedule' },
  { id: '46', question: 'Hertford hosts an annual arts trail called what?', options: ['Hertford Art Trail', 'Open Studios Hertford', 'ArtBeat', 'Creative Hertford'], correctAnswer: 1, category: 'events', difficulty: 'medium', source: 'Hertford Civic Society arts programme' },
  { id: '47', question: 'The Hertford Drama Festival is held at which venue?', options: ['Hertford Theatre', 'Castle Hall', 'Shire Hall', 'Corn Exchange'], correctAnswer: 0, category: 'events', difficulty: 'easy', source: 'Hertford Theatre programme listings' },
  { id: '48', question: 'Which annual sporting event takes place on the River Lea in Hertford?', options: ['The Hertford Raft Race', 'Lea Valley Regatta', 'Dragon Boat Festival', 'Hertford Canoe Marathon'], correctAnswer: 0, category: 'events', difficulty: 'medium', source: 'Hertford Town Council community events' },

  // === LOCAL BUSINESS ===
  { id: '49', question: "McMullen's brewery headquarters is on which road in Hertford?", options: ['Old Cross', 'Hartham Lane', 'Fore Street', 'Railway Street'], correctAnswer: 0, category: 'local-business', difficulty: 'medium', source: "McMullen & Sons Ltd registered address" },
  { id: '50', question: 'Which independent cinema operated in Hertford before the Hertford Theatre?', options: ['The County Cinema', 'Castle Cinema', 'The Regal', 'Hertford Odeon'], correctAnswer: 0, category: 'local-business', difficulty: 'hard', source: 'Cinema Treasures historical database' },
]

const SEEN_QUESTIONS_KEY = 'hertford_quiz_seen_questions'

/**
 * Get questions the user has already seen
 */
function getSeenQuestionIds(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem(SEEN_QUESTIONS_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

/**
 * Mark questions as seen
 */
function markQuestionsSeen(questionIds: string[]): void {
  if (typeof window === 'undefined') return
  const existing = getSeenQuestionIds()
  const updated = [...new Set([...existing, ...questionIds])]
  
  // If the user has seen all questions, reset the pool
  if (updated.length >= questions.length) {
    localStorage.setItem(SEEN_QUESTIONS_KEY, JSON.stringify([]))
  } else {
    localStorage.setItem(SEEN_QUESTIONS_KEY, JSON.stringify(updated))
  }
}

/**
 * Returns quiz questions prioritising unseen ones.
 * Once all questions are seen, resets and starts fresh.
 */
export function getQuizQuestions(count: number = 10): QuizQuestion[] {
  const seenIds = getSeenQuestionIds()
  
  // Split into unseen and seen
  const unseen = questions.filter(q => !seenIds.includes(q.id))
  const seen = questions.filter(q => seenIds.includes(q.id))
  
  // Shuffle both pools
  const shuffledUnseen = [...unseen].sort(() => Math.random() - 0.5)
  const shuffledSeen = [...seen].sort(() => Math.random() - 0.5)
  
  // Prioritise unseen questions, fill remainder with seen if needed
  let selected: QuizQuestion[]
  if (shuffledUnseen.length >= count) {
    selected = shuffledUnseen.slice(0, count)
  } else {
    selected = [...shuffledUnseen, ...shuffledSeen.slice(0, count - shuffledUnseen.length)]
  }
  
  // Mark these as seen
  markQuestionsSeen(selected.map(q => q.id))
  
  // Final shuffle so unseen aren't always first
  return selected.sort(() => Math.random() - 0.5)
}
