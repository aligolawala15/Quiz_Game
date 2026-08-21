/* ============================================================
   QUIZVERSE — Question Bank
   Each: { q, options:[4], answer:index(0-3), difficulty, explain? }
   Categories grouped below. All facts verified for correctness.
   ============================================================ */
(function (QV) {
  'use strict';

  QV.CATEGORIES = [
    { id: 'technology', name: 'Technology',        icon: '💻', desc: 'Questions about computers, programming, AI and technology.' },
    { id: 'general',    name: 'General Knowledge', icon: '🧠', desc: 'Interesting questions from everyday knowledge.' },
    { id: 'science',    name: 'Science',           icon: '🔬', desc: 'Physics, chemistry, biology and scientific discoveries.' },
    { id: 'geography',  name: 'Geography',         icon: '🌍', desc: 'Countries, capitals, landmarks and world geography.' },
    { id: 'history',    name: 'History',           icon: '🏛️', desc: 'Historical events, civilizations and important personalities.' },
    { id: 'sports',     name: 'Sports',            icon: '⚽', desc: 'Football, cricket, basketball and other sports.' },
  ];

  QV.DIFFICULTIES = [
    { id: 'easy',   name: 'Easy',   icon: '🌱', desc: 'Perfect for beginners.',   time: 20 },
    { id: 'medium', name: 'Medium', icon: '⚔️', desc: 'Ready for a challenge?',   time: 15 },
    { id: 'hard',   name: 'Hard',   icon: '🔥', desc: 'Only for quiz masters.',   time: 12 },
  ];

  // Question sets keyed by category id.
  const Q = {};

  /* ============================ TECHNOLOGY ============================ */
  Q.technology = [
    // EASY
    { q: 'Which programming language is primarily used to style web pages?', options: ['Python', 'CSS', 'Java', 'C++'], answer: 1, difficulty: 'easy', explain: 'CSS (Cascading Style Sheets) controls the visual styling of web pages.' },
    { q: 'What does CPU stand for?', options: ['Central Processing Unit', 'Computer Personal Unit', 'Central Program Utility', 'Computer Processing Utility'], answer: 0, difficulty: 'easy', explain: 'The CPU is the "brain" of the computer that executes instructions.' },
    { q: 'Which company developed the Windows operating system?', options: ['Apple', 'Microsoft', 'Google', 'IBM'], answer: 1, difficulty: 'easy' },
    { q: 'What does "www" stand for?', options: ['World Wide Web', 'Web World Wide', 'Wide World Web', 'World Web Wide'], answer: 0, difficulty: 'easy' },
    { q: 'Which of these is a popular web browser?', options: ['Photoshop', 'Chrome', 'Excel', 'Android'], answer: 1, difficulty: 'easy' },
    { q: 'What symbol is used to start most HTML tags?', options: ['{', '<', '(', '#'], answer: 1, difficulty: 'easy', explain: 'HTML tags are wrapped in angle brackets, e.g. <p>.' },
    // MEDIUM
    { q: 'Which language is known as the language of the web browser for interactivity?', options: ['Java', 'JavaScript', 'C#', 'Ruby'], answer: 1, difficulty: 'medium', explain: 'JavaScript runs natively in browsers to add interactivity.' },
    { q: 'What does "HTTP" stand for?', options: ['HyperText Transfer Protocol', 'High Transfer Text Protocol', 'HyperText Transmission Process', 'Home Tool Transfer Protocol'], answer: 0, difficulty: 'medium' },
    { q: 'In computing, what does "RAM" stand for?', options: ['Read Access Memory', 'Random Access Memory', 'Rapid Application Memory', 'Runtime Allocated Memory'], answer: 1, difficulty: 'medium' },
    { q: 'Which data structure uses LIFO (Last In, First Out)?', options: ['Queue', 'Stack', 'Array', 'Tree'], answer: 1, difficulty: 'medium', explain: 'A stack removes the most recently added element first (LIFO).' },
    { q: 'What does "AI" stand for in technology?', options: ['Automated Interface', 'Artificial Intelligence', 'Advanced Integration', 'Applied Informatics'], answer: 1, difficulty: 'medium' },
    { q: 'Which company created the iPhone?', options: ['Samsung', 'Apple', 'Nokia', 'Sony'], answer: 1, difficulty: 'medium' },
    // HARD
    { q: 'What is the time complexity of binary search on a sorted array?', options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'], answer: 1, difficulty: 'hard', explain: 'Binary search halves the search space each step, giving O(log n).' },
    { q: 'Which protocol is used to securely transfer web pages?', options: ['FTP', 'HTTPS', 'SMTP', 'TELNET'], answer: 1, difficulty: 'hard', explain: 'HTTPS encrypts HTTP traffic using TLS.' },
    { q: 'Who is credited with proposing the World Wide Web in 1989?', options: ['Bill Gates', 'Tim Berners-Lee', 'Steve Jobs', 'Alan Turing'], answer: 1, difficulty: 'hard' },
    { q: 'In databases, what does "SQL" stand for?', options: ['Structured Query Language', 'Simple Question Language', 'Sequential Query Logic', 'System Query Layer'], answer: 0, difficulty: 'hard' },
    { q: 'Which sorting algorithm has the best average-case time complexity of O(n log n) and is a "divide and conquer" method?', options: ['Bubble Sort', 'Merge Sort', 'Insertion Sort', 'Selection Sort'], answer: 1, difficulty: 'hard' },
  ];

  /* ============================ GENERAL ============================ */
  Q.general = [
    // EASY
    { q: 'How many days are there in a leap year?', options: ['365', '366', '364', '367'], answer: 1, difficulty: 'easy', explain: 'A leap year adds February 29th, making 366 days.' },
    { q: 'What color do you get by mixing blue and yellow?', options: ['Purple', 'Green', 'Orange', 'Brown'], answer: 1, difficulty: 'easy' },
    { q: 'How many colors are there in a rainbow?', options: ['5', '6', '7', '8'], answer: 2, difficulty: 'easy', explain: 'Red, orange, yellow, green, blue, indigo, violet — 7 colors.' },
    { q: 'Which is the largest ocean on Earth?', options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], answer: 3, difficulty: 'easy' },
    { q: 'How many minutes are there in one hour?', options: ['30', '60', '90', '120'], answer: 1, difficulty: 'easy' },
    { q: 'What is the primary language spoken in Brazil?', options: ['Spanish', 'Portuguese', 'French', 'English'], answer: 1, difficulty: 'easy' },
    // MEDIUM
    { q: 'How many continents are there on Earth?', options: ['5', '6', '7', '8'], answer: 2, difficulty: 'medium' },
    { q: 'Which planet is known as the Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Mercury'], answer: 1, difficulty: 'medium', explain: 'Iron oxide (rust) gives Mars its reddish appearance.' },
    { q: 'What is the currency of Japan?', options: ['Won', 'Yuan', 'Yen', 'Ringgit'], answer: 2, difficulty: 'medium' },
    { q: 'How many sides does a hexagon have?', options: ['5', '6', '7', '8'], answer: 1, difficulty: 'medium' },
    { q: 'Which instrument has 88 keys?', options: ['Guitar', 'Piano', 'Violin', 'Flute'], answer: 1, difficulty: 'medium' },
    // HARD
    { q: 'What is the most widely spoken native language in the world?', options: ['English', 'Hindi', 'Mandarin Chinese', 'Spanish'], answer: 2, difficulty: 'hard', explain: 'Mandarin Chinese has the most native speakers worldwide.' },
    { q: 'Roman numeral "M" represents which number?', options: ['100', '500', '1000', '5000'], answer: 2, difficulty: 'hard' },
    { q: 'Which is the hardest naturally occurring substance on Earth?', options: ['Gold', 'Iron', 'Diamond', 'Quartz'], answer: 2, difficulty: 'hard' },
  ];

  /* ============================ SCIENCE ============================ */
  Q.science = [
    // EASY
    { q: 'What gas do humans need to breathe to survive?', options: ['Carbon dioxide', 'Oxygen', 'Nitrogen', 'Helium'], answer: 1, difficulty: 'easy' },
    { q: 'What is H2O commonly known as?', options: ['Salt', 'Water', 'Oxygen', 'Hydrogen'], answer: 1, difficulty: 'easy' },
    { q: 'How many bones does an adult human body have?', options: ['206', '201', '212', '198'], answer: 0, difficulty: 'easy', explain: 'Adults have 206 bones; babies are born with about 270.' },
    { q: 'Which planet do we live on?', options: ['Mars', 'Venus', 'Earth', 'Saturn'], answer: 2, difficulty: 'easy' },
    { q: 'What organ pumps blood through the human body?', options: ['Lungs', 'Brain', 'Heart', 'Liver'], answer: 2, difficulty: 'easy' },
    { q: 'Which part of the plant absorbs sunlight for photosynthesis?', options: ['Roots', 'Leaves', 'Stem', 'Flowers'], answer: 1, difficulty: 'easy' },
    // MEDIUM
    { q: 'What is the chemical symbol for gold?', options: ['Go', 'Gd', 'Au', 'Ag'], answer: 2, difficulty: 'medium', explain: 'Au comes from the Latin word "aurum".' },
    { q: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi body'], answer: 1, difficulty: 'medium' },
    { q: 'At what temperature does water boil at sea level (Celsius)?', options: ['90°C', '100°C', '110°C', '80°C'], answer: 1, difficulty: 'medium' },
    { q: 'Which gas makes up most of Earth\u2019s atmosphere?', options: ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Hydrogen'], answer: 2, difficulty: 'medium', explain: 'Nitrogen makes up about 78% of the atmosphere.' },
    { q: 'What force keeps us grounded on Earth?', options: ['Magnetism', 'Friction', 'Gravity', 'Inertia'], answer: 2, difficulty: 'medium' },
    // HARD
    { q: 'What is the speed of light in a vacuum (approximate)?', options: ['300,000 km/s', '150,000 km/s', '30,000 km/s', '3,000 km/s'], answer: 0, difficulty: 'hard', explain: 'Light travels about 299,792 km/s in a vacuum.' },
    { q: 'Which scientist proposed the theory of general relativity?', options: ['Isaac Newton', 'Albert Einstein', 'Niels Bohr', 'Galileo Galilei'], answer: 1, difficulty: 'hard' },
    { q: 'What is the pH value of a neutral solution at 25°C?', options: ['0', '7', '14', '1'], answer: 1, difficulty: 'hard' },
    { q: 'Which element has the atomic number 1?', options: ['Helium', 'Hydrogen', 'Oxygen', 'Carbon'], answer: 1, difficulty: 'hard' },
  ];

  /* ============================ GEOGRAPHY ============================ */
  Q.geography = [
    // EASY
    { q: 'What is the capital city of France?', options: ['London', 'Berlin', 'Paris', 'Madrid'], answer: 2, difficulty: 'easy' },
    { q: 'Which country is known as the Land of the Rising Sun?', options: ['China', 'Japan', 'Thailand', 'Korea'], answer: 1, difficulty: 'easy' },
    { q: 'What is the largest continent by area?', options: ['Africa', 'Asia', 'Europe', 'North America'], answer: 1, difficulty: 'easy' },
    { q: 'Which is the longest river in the world?', options: ['Amazon', 'Nile', 'Yangtze', 'Mississippi'], answer: 1, difficulty: 'easy', explain: 'The Nile is generally regarded as the longest river (~6,650 km).' },
    { q: 'The Great Pyramids are located in which country?', options: ['Mexico', 'Egypt', 'India', 'Iraq'], answer: 1, difficulty: 'easy' },
    { q: 'Which ocean lies on the east coast of the United States?', options: ['Pacific', 'Indian', 'Atlantic', 'Arctic'], answer: 2, difficulty: 'easy' },
    // MEDIUM
    { q: 'What is the capital of Australia?', options: ['Sydney', 'Melbourne', 'Canberra', 'Perth'], answer: 2, difficulty: 'medium', explain: 'Canberra is the capital, not Sydney.' },
    { q: 'Mount Everest lies on the border of Nepal and which country?', options: ['India', 'China', 'Bhutan', 'Pakistan'], answer: 1, difficulty: 'medium' },
    { q: 'Which country has the largest population in the world (2024)?', options: ['China', 'India', 'USA', 'Indonesia'], answer: 1, difficulty: 'medium', explain: 'India overtook China as the most populous country.' },
    { q: 'The Sahara Desert is located on which continent?', options: ['Asia', 'Australia', 'Africa', 'South America'], answer: 2, difficulty: 'medium' },
    { q: 'What is the capital of Canada?', options: ['Toronto', 'Vancouver', 'Ottawa', 'Montreal'], answer: 2, difficulty: 'medium' },
    // HARD
    { q: 'Which country has the most time zones?', options: ['Russia', 'USA', 'France', 'China'], answer: 2, difficulty: 'hard', explain: 'Including overseas territories, France spans 12 time zones.' },
    { q: 'What is the smallest country in the world by area?', options: ['Monaco', 'Nauru', 'Vatican City', 'San Marino'], answer: 2, difficulty: 'hard' },
    { q: 'Which line of latitude divides the Earth into Northern and Southern hemispheres?', options: ['Prime Meridian', 'Tropic of Cancer', 'Equator', 'Arctic Circle'], answer: 2, difficulty: 'hard' },
    { q: 'Lake Baikal, the world\u2019s deepest lake, is located in which country?', options: ['Canada', 'Russia', 'Mongolia', 'Kazakhstan'], answer: 1, difficulty: 'hard' },
  ];

  /* ============================ HISTORY ============================ */
  Q.history = [
    // EASY
    { q: 'Who was the first President of the United States?', options: ['Abraham Lincoln', 'George Washington', 'Thomas Jefferson', 'John Adams'], answer: 1, difficulty: 'easy' },
    { q: 'In which year did World War II end?', options: ['1942', '1945', '1939', '1950'], answer: 1, difficulty: 'easy' },
    { q: 'The ancient pyramids were built by which civilization?', options: ['Romans', 'Greeks', 'Egyptians', 'Persians'], answer: 2, difficulty: 'easy' },
    { q: 'Who is known for the theory of gravity after an apple fell?', options: ['Einstein', 'Newton', 'Galileo', 'Darwin'], answer: 1, difficulty: 'easy' },
    { q: 'Which country gifted the Statue of Liberty to the USA?', options: ['England', 'Germany', 'France', 'Italy'], answer: 2, difficulty: 'easy' },
    // MEDIUM
    { q: 'Who painted the Mona Lisa?', options: ['Michelangelo', 'Leonardo da Vinci', 'Raphael', 'Van Gogh'], answer: 1, difficulty: 'medium' },
    { q: 'The Great Wall is located in which country?', options: ['Japan', 'India', 'China', 'Korea'], answer: 2, difficulty: 'medium' },
    { q: 'Who was the British Prime Minister during most of World War II?', options: ['Neville Chamberlain', 'Winston Churchill', 'Clement Attlee', 'Tony Blair'], answer: 1, difficulty: 'medium' },
    { q: 'In which year did the Titanic sink?', options: ['1905', '1912', '1918', '1923'], answer: 1, difficulty: 'medium' },
    { q: 'Which empire was ruled by Julius Caesar?', options: ['Greek', 'Ottoman', 'Roman', 'Persian'], answer: 2, difficulty: 'medium' },
    // HARD
    { q: 'Who was the first man to walk on the Moon?', options: ['Buzz Aldrin', 'Yuri Gagarin', 'Neil Armstrong', 'Michael Collins'], answer: 2, difficulty: 'hard', explain: 'Neil Armstrong stepped onto the Moon on July 20, 1969.' },
    { q: 'The French Revolution began in which year?', options: ['1776', '1789', '1804', '1815'], answer: 1, difficulty: 'hard' },
    { q: 'Which ancient wonder still stands today?', options: ['Colossus of Rhodes', 'Great Pyramid of Giza', 'Hanging Gardens', 'Lighthouse of Alexandria'], answer: 1, difficulty: 'hard' },
    { q: 'Who wrote the Communist Manifesto with Friedrich Engels?', options: ['Vladimir Lenin', 'Karl Marx', 'Joseph Stalin', 'Leon Trotsky'], answer: 1, difficulty: 'hard' },
  ];

  /* ============================ SPORTS ============================ */
  Q.sports = [
    // EASY
    { q: 'How many players are there in a football (soccer) team on the field?', options: ['9', '10', '11', '12'], answer: 2, difficulty: 'easy' },
    { q: 'In which sport would you perform a "slam dunk"?', options: ['Football', 'Basketball', 'Tennis', 'Cricket'], answer: 1, difficulty: 'easy' },
    { q: 'How many rings are on the Olympic flag?', options: ['4', '5', '6', '7'], answer: 1, difficulty: 'easy', explain: 'The five rings represent the five inhabited continents.' },
    { q: 'In cricket, how many runs is a "boundary" hit along the ground worth?', options: ['2', '4', '6', '8'], answer: 1, difficulty: 'easy' },
    { q: 'Which sport uses a racket and a shuttlecock?', options: ['Tennis', 'Badminton', 'Squash', 'Table tennis'], answer: 1, difficulty: 'easy' },
    // MEDIUM
    { q: 'How often are the Summer Olympic Games held?', options: ['Every 2 years', 'Every 3 years', 'Every 4 years', 'Every 5 years'], answer: 2, difficulty: 'medium' },
    { q: 'Which country has won the most FIFA World Cup titles?', options: ['Germany', 'Argentina', 'Brazil', 'Italy'], answer: 2, difficulty: 'medium', explain: 'Brazil has won the World Cup 5 times.' },
    { q: 'In tennis, what is a score of zero called?', options: ['Nil', 'Love', 'Duck', 'Blank'], answer: 1, difficulty: 'medium' },
    { q: 'How many points is a touchdown worth in American football?', options: ['3', '6', '7', '2'], answer: 1, difficulty: 'medium' },
    { q: 'Which sport is Michael Jordan famous for?', options: ['Baseball', 'Basketball', 'Golf', 'Boxing'], answer: 1, difficulty: 'medium' },
    // HARD
    { q: 'Which country hosted the 2016 Summer Olympics?', options: ['China', 'UK', 'Brazil', 'Japan'], answer: 2, difficulty: 'hard', explain: 'Rio de Janeiro, Brazil hosted the 2016 Olympics.' },
    { q: 'In cricket, how many balls make up one over?', options: ['4', '5', '6', '8'], answer: 2, difficulty: 'hard' },
    { q: 'Who holds the record for most Grand Slam singles titles in men\u2019s tennis (as of 2024)?', options: ['Roger Federer', 'Rafael Nadal', 'Novak Djokovic', 'Pete Sampras'], answer: 2, difficulty: 'hard', explain: 'Novak Djokovic holds the record with 24 Grand Slam titles.' },
    { q: 'In Formula 1, what flag signals the end of a race?', options: ['Red flag', 'Yellow flag', 'Chequered flag', 'Blue flag'], answer: 2, difficulty: 'hard' },
  ];

  QV.QUESTIONS = Q;

  QV.getCategory = (id) => QV.CATEGORIES.find((c) => c.id === id);
  QV.getDifficulty = (id) => QV.DIFFICULTIES.find((d) => d.id === id);

  /**
   * Build a randomized quiz for a category + difficulty.
   * Falls back to easier/other difficulties in that category if a pool is thin,
   * so a quiz is always produced (error handling requirement).
   * Returns { questions:[...], meta } or { error }.
   */
  QV.buildQuiz = function (categoryId, difficulty, count) {
    count = count || 10;
    const pool = Q[categoryId];
    if (!pool || !pool.length) return { error: 'No questions available for this category.' };

    let picked = pool.filter((x) => x.difficulty === difficulty);
    // Top up from other difficulties (prefer nearby) if not enough at this level.
    if (picked.length < count) {
      const order = { easy: ['medium', 'hard'], medium: ['easy', 'hard'], hard: ['medium', 'easy'] };
      const extras = pool.filter((x) => x.difficulty !== difficulty)
        .sort((a, b) => order[difficulty].indexOf(a.difficulty) - order[difficulty].indexOf(b.difficulty));
      picked = picked.concat(extras);
    }

    const total = Math.min(count, picked.length);
    const chosen = QV.shuffle(picked).slice(0, total);
    if (!chosen.length) return { error: 'Could not load questions. Please try again.' };

    // Randomize option order per question while tracking the correct index.
    const questions = chosen.map((item) => {
      const correctText = item.options[item.answer];
      const opts = QV.shuffle(item.options);
      return {
        q: item.q,
        options: opts,
        answer: opts.indexOf(correctText),
        explain: item.explain || '',
        difficulty: item.difficulty,
      };
    });

    return {
      questions,
      meta: { categoryId, difficulty, total: questions.length, timePerQ: (QV.getDifficulty(difficulty) || {}).time || 15 },
    };
  };
})(window.QV);
