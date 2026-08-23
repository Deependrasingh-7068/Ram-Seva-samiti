// Placeholder site settings. In production this object is fetched from
// GET /api/settings (backed by the Settings model / admin panel) so that
// nothing here needs to be hard-coded across components.
const settings = {
  samitiName: 'Ram Sewa Samiti',
  tagline: 'सेवा • संस्कार • समर्पण',
  taglineEnglish: 'Seva • Sanskar • Samarpan',
  phone: '+91 98765 43210',
  email: 'contact@ramsewasamiti.org',
  address: 'Ram Mandir Marg, Village Chandanpur, Uttar Pradesh, India',
  whatsappLink: 'https://chat.whatsapp.com/Iy1QEIDTSDQ686Iuy4UMh8',
  mapsLink: 'https://maps.google.com/?q=Ram+Sewa+Samiti',
  socialLinks: {
    facebook: 'https://facebook.com/ramsewasamiti',
    instagram: 'https://instagram.com/ramsewasamiti',
    youtube: 'https://youtube.com/@ramsewasamiti',
  },
  footerText: 'एक सेवा भावना से जुड़ा समाज, जो श्रद्धा और संस्कार को आगे ले जाता है।',
  dailyQuote: {
    hindi: 'परहित सरिस धरम नहि दूजा।',
    meaning: 'There is no greater duty than serving others — Goswami Tulsidas, Ramcharitmanas',
  },
  
  // Saare Daily Thoughts ab yahan hain
  dailyThoughts: [
    {
      hindi: "“परहित सरिस धरम नहिं दूजा ।”",
      english: "There is no greater duty than serving others — Goswami Tulsidas, Ramcharitmanas"
    },
    {
      hindi: "“कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।”",
      english: "You have a right to perform your prescribed duty, but you are not entitled to the fruits of action — Bhagavad Gita"
    },
    {
      hindi: "“विश्वास वह शक्ति है, जिससे उजड़ी हुई दुनिया में प्रकाश लाया जा सकता है।”",
      english: "Faith is the bird that feels the light when the dawn is still dark — Rabindranath Tagore"
    },
    {
      hindi: "“सत्य परेशान हो सकता है, पराजित नहीं।”",
      english: "Truth can be disturbed, but not defeated — Chanakya"
    },
    {
      hindi: "“विद्या ददाति विनयम, विनयाद याति पात्रताम्।”",
      english: "Education gives humility, from humility comes worthiness — Hitopadesha"
    },
    {
      hindi: "“उद्यमेन हि सिध्यन्ति कार्याणि न मनोरथैः।”",
      english: "Success comes from hard work, not just by wishing — Sanskrit Proverb"
    },
    {
      hindi: "“अहिंसा परमो धर्मः।”",
      english: "Non-violence is the highest duty — Mahabharata"
    },
    {
      hindi: "“यत्र नार्यस्तु पूज्यन्ते रमन्ते तत्र देवताः।”",
      english: "Where women are respected, there the gods reside — Manusmriti"
    },
    {
      hindi: "“सत्यमेव जयते नानृतम्।”",
      english: "Truth alone triumphs, not falsehood — Mundaka Upanishad"
    },
    {
      hindi: "“वसुधैव कुटुंबकम्।”",
      english: "The whole world is one family — Maha Upanishad"
    },
    {
      hindi: "“श्रद्धा लभते ज्ञानं।”",
      english: "A faithful person attains knowledge — Bhagavad Gita"
    },
    {
      hindi: "“योगः कर्मसु कौशलम्।”",
      english: "Yoga is skill in action — Bhagavad Gita"
    },
    {
      hindi: "“शरीरमाद्यं खलु धर्मसाधनम्।”",
      english: "The body is indeed the primary instrument of fulfilling duty — Kalidasa"
    },
    {
      hindi: "“जननी जन्मभूमिष्च स्वर्गादपि गरीयसी।”",
      english: "Mother and motherland are greater than heaven — Ramayana"
    },
    {
      hindi: "“मा हिंस्यात् सर्वभूतानि।”",
      english: "Do not injure any living being — Yajurveda"
    },
    {
      hindi: "“संतोष एव पुरुषस्य परं निधानम्।”",
      english: "Contentment is man's greatest treasure — Chanakya"
    },
    {
      hindi: "“ज्ञानेन तु तदज्ञानं जेशनं येषामात्मनः।”",
      english: "Knowledge destroys ignorance when the self is realized — Bhagavad Gita"
    },
    {
      hindi: "“उद्योगिनं पुरुषसिंहमुपैति लक्ष्मीः।”",
      english: "Fortune favors the brave and hardworking person — Hitopadesha"
    },
    {
      hindi: "“संसार में धैर्य सबसे बड़ा आभूषण है।”",
      english: "Patience is the greatest ornament in the world — Ancient Proverb"
    },
    {
      hindi: "“मन एव मनुष्याणां कारणं बन्धमोक्षयोः।”",
      english: "Mind alone is the cause of human bondage and liberation — Maitri Upanishad"
    },
    {
      hindi: "“आलस्यं हि मनुष्याणां शरीरस्थो महान् रिपुः।”",
      english: "Procrastination and laziness are the greatest enemies residing within the human body — Acharya Chanakya"
    },
    {
      hindi: "“परिश्रमी व्यक्ति के लिए इस संसार में कुछ भी असंभव नहीं है।”",
      english: "Nothing is impossible in this world for a hardworking person — Ancient Proverb"
    },
    {
      hindi: "“सज्जनानां मैत्री चंदनवृत्तिमिव भवति।”",
      english: "Friendship with noble people is like the sandalwood tree — Sanskrit Subhashita"
    },
    {
      hindi: "“नमन्ति फलिनो वृक्षा नमन्ति गुणिनो जनाः।”",
      english: "Fruit-laden trees bend down, and virtuous people are always humble — Chanakya Niti"
    },
    {
      hindi: "“शीलमेव सर्वोच्चं भूषणमस्ति।”",
      english: "Good character is indeed the highest adornment — Sanskrit Proverb"
    },
    {
      hindi: "“मातृदेवो भव, पितृदेवो भव।”",
      english: "Treat your mother and father as God — Taittiriya Upanishad"
    },
    {
      hindi: "“अतिथिदेवो भव।”",
      english: "Treat your guest as God — Taittiriya Upanishad"
    },
    {
      hindi: "“आचार्यदेवो भव।”",
      english: "Treat your teacher as God — Taittiriya Upanishad"
    },
    {
      hindi: "“धर्मो रक्षति रक्षितः।”",
      english: "Dharma protects those who protect it — Manusmriti"
    },
    {
      hindi: "“न हि ज्ञानेन सदृशं पवित्रमिह विद्यते।”",
      english: "There is nothing in this world as pure as true knowledge — Bhagavad Gita"
    },
    {
      hindi: "“स्वावलंबनं सर्वदा सुखप्रदम् भवति।”",
      english: "Self-reliance always brings happiness — Sanskrit Proverb"
    },
    {
      hindi: "“क्षमा वीरास्य भूषणम्।”",
      english: "Forgiveness is the ornament of the brave — Ancient Proverb"
    },
    {
      hindi: "“मौनं सर्वार्थसाधनम्।”",
      english: "Silence often accomplishes all purposes — Sanskrit Subhashita"
    },
    {
      hindi: "“लोभः पापस्य कारणम्।”",
      english: "Greed is the root cause of all sins — Hitopadesha"
    },
    {
      hindi: "“सत्यं ब्रूयात प्रियं ब्रूयात।”",
      english: "Speak the truth, and speak it pleasantly — Manusmriti"
    },
    {
      hindi: "“परोपकार पुण्याय पापाय परपीडनम्।”",
      english: "Helping others brings merit, while causing pain to others brings sin — Mahabharata"
    },
    {
      hindi: "“असंशयं महाबाहो मनो दुर्निग्रहं चलम्।”",
      english: "Undoubtedly, O mighty-armed Arjuna, the mind is restless and difficult to restrain — Bhagavad Gita"
    },
    {
      hindi: "“नास्ति विद्यासमं चक्षुः नास्ति सत्यसमं तपः।”",
      english: "There is no eye like knowledge, and no austerity like truth — Chanakya"
    },
    {
      hindi: "“न चौरहार्यं न च राजहार्यम्।”",
      english: "Knowledge can neither be stolen by thieves nor seized by kings — Subhashita"
    },
    {
      hindi: "“विद्या धनं सर्वधन प्रधानम्।”",
      english: "The wealth of knowledge is supreme among all wealth — Subhashita"
    },
    {
      hindi: "“संसार सागर को तैरने के लिए भक्ति ही नौका है।”",
      english: "Devotion is the boat to cross the ocean of worldly existence — Swami Vivekananda"
    },
    {
      hindi: "“उत्तिष्ठत जाग्रत प्राप्य वरान्निबोधत।”",
      english: "Arise, awake, and stop not until the goal is reached — Katha Upanishad"
    },
    {
      hindi: "“आत्मोद्धारः कर्तव्यो न आत्मानमवसादयेत्।”",
      english: "One should elevate oneself by one's own mind, and not degrade oneself — Bhagavad Gita"
    },
    {
      hindi: "“सुखदुःखे समे कृत्वा लाभालाभौ जयाजयौ।”",
      english: "Treating happiness and distress, loss and gain, victory and defeat as the same — Bhagavad Gita"
    },
    {
      hindi: "“अक्रोधेन जयेत्क्रोधम् असाधुं साधुना जयेत्।”",
      english: "Conquer anger by non-anger, and wickedness by goodness — Dhammapada"
    },
    {
      hindi: "“यथा दृष्टिः तथा सृष्टिः।”",
      english: "As your vision is, so is your creation/world — Ancient Proverb"
    },
    {
      hindi: "“परकीयस्वभावस्य परिवर्तनं दुर्लभम्।”",
      english: "It is difficult to change another person's inherent nature — Chanakya"
    },
    {
      hindi: "“मित्रं प्रीतिं सदा कुर्याद् दुष्टं त्यजेत् दूरतः।”",
      english: "Always cultivate friendship with the good and stay away from the wicked — Subhashita"
    },
    {
      hindi: "“अनभ्यासे विषं विद्या।”",
      english: "Unpracticed knowledge turns into poison — Sanskrit Proverb"
    },
    {
      hindi: "“संतोषी सदा सुखी।”",
      english: "A contented person is always happy — Hindi Proverb"
    },
    {
      hindi: "“जैसी संगत तैसी रंगत।”",
      english: "A man is known by the company he keeps — Hindi Proverb"
    },
    {
      hindi: "“जैसी करनी वैसी भरनी।”",
      english: "As you sow, so shall you reap — Hindi Proverb"
    },
    {
      hindi: "“अंत भला तो सब भला।”",
      english: "All's well that ends well — Hindi Proverb"
    },
    {
      hindi: "“अब होत का पछताए जब चिड़िया चुग गई खेत।”",
      english: "It is no use crying over spilt milk — Hindi Proverb"
    },
    {
      hindi: "“जल ही जीवन है।”",
      english: "Water is life — Hindi Proverb"
    },
    {
      hindi: "“समय किसी के लिए नहीं रुकता।”",
      english: "Time waits for no one — Hindi Proverb"
    },
    {
      hindi: "“अधजल गगरी छलकत जाऐ।”",
      english: "An empty vessel makes much noise — Hindi Proverb"
    },
    {
      hindi: "“एक और एक ग्यारह होते हैं।”",
      english: "Unity is strength — Hindi Proverb"
    },
    {
      hindi: "“जैसी दृष्टि वैसी सृष्टि।”",
      english: "Beauty lies in the eyes of the beholder / Your mindset shapes your reality — Indian Proverb"
    },
    {
      hindi: "“बूंद-बूंद से घड़ा भरता है।”",
      english: "Drops of water make a mighty ocean — Hindi Proverb"
    },
    {
      hindi: "“चोर की दाढ़ी में तिनका।”",
      english: "A guilty conscience needs no accuser — Hindi Proverb"
    },
    {
      hindi: "“दूर के ढोल सुहावने लगते हैं।”",
      english: "Distance lends enchantment to the view — Hindi Proverb"
    },
    {
      hindi: "“घर की मुर्गी दाल बराबर।”",
      english: "Familiarity breeds contempt — Hindi Proverb"
    },
    {
      hindi: "“जैसा देश वैसा भेष।”",
      english: "When in Rome, do as the Romans do — Hindi Proverb"
    },
    {
      hindi: "“जहाँ चाह वहाँ राह।”",
      english: "Where there's a will, there's a way — Hindi Proverb"
    },
    {
      hindi: "“जिसकी लाठी उसकी भैंस।”",
      english: "Might is right — Hindi Proverb"
    },
    {
      hindi: "“कर भला तो हो भला।”",
      english: "Good deeds bring good results — Hindi Proverb"
    },
    {
      hindi: "“मान न मान मैं आपका मेहमान।”",
      english: "Uninvited guests are unwelcome — Hindi Proverb"
    },
    {
      hindi: "“नाच न जाने आंगन टेढ़ा।”",
      english: "A bad workman blames his tools — Hindi Proverb"
    },
    {
      hindi: "“नौ सौ चूहे खा के बिल्ली हज को चली।”",
      english: "The devil quoting scripture — Hindi Proverb"
    },
    {
      hindi: "“सांच को आंच क्या।”",
      english: "Truth fears no trial — Hindi Proverb"
    },
    {
      hindi: "“तंदुरुस्ती हजार नेमत है।”",
      english: "Health is wealth — Hindi Proverb"
    },
    {
      hindi: "“थोथा चना बाजे घना।”",
      english: "Empty vessels make the most noise — Hindi Proverb"
    },
    {
      hindi: "“जैसी बहे बियर पीठ तब तैसी दीजे।”",
      english: "Make hay while the sun shines — Hindi Proverb"
    },
    {
      hindi: "“जो गरजते हैं वे बरसते नहीं।”",
      english: "Barking dogs seldom bite — Hindi Proverb"
    },
    {
      hindi: "“अंत भवा तो सब भला।”",
      english: "All's well that ends well — Hindi Proverb"
    },
    {
      hindi: "“आप भला तो जग भला।”",
      english: "To the pure, all things are pure — Hindi Proverb"
    },
    {
      hindi: "“आवश्यकता आविष्कार की जननी है।”",
      english: "Necessity is the mother of invention — Hindi Proverb"
    },
    {
      hindi: "“बिन मांगे मोती मिले, मांगे मिले न भीख।”",
      english: "Sometimes silence and patience get you what begging cannot — Hindi Proverb"
    },
    {
      hindi: "“धैर्य का फल मीठा होता है।”",
      english: "Patience is a virtue / Patience is bitter, but its fruit is sweet — Hindi Proverb"
    },
    {
      hindi: "“अंधों में काना राजा।”",
      english: "A figure among ciphers / In the country of the blind, the one-eyed man is king — Hindi Proverb"
    },
    {
      hindi: "“खोदा पहाड़ निकली चुहिया।”",
      english: "Great cry and little wool — Hindi Proverb"
    },
    {
      hindi: "“ऊप्स की दुकान फीका पकवान।”",
      english: "Great boast, small roast — Hindi Proverb"
    },
    {
      hindi: "“सौ सुनार की, एक लुहार की।”",
      english: "One stroke of a blacksmith is worth a hundred strokes of a goldsmith — Hindi Proverb"
    },
    {
      hindi: "“सौ चूहा खा के बिल्ली चली हज को।”",
      english: "The cat that has eaten nine mice is going on a pilgrimage — Hindi Proverb"
    },
    {
      hindi: "“अपनी गली में कुत्ता भी शेर होता है।”",
      english: "Every dog is a lion on his own dunghill — Hindi Proverb"
    },
    {
      hindi: "“भागते भूत की लंगोटी ही सही।”",
      english: "Something is better than nothing — Hindi Proverb"
    },
    {
      hindi: "“जिंदगी एक सफर है, सेवा ही इसका मार्ग है।”",
      english: "Life is a journey, and selfless service is its true path — Ram Sewa Samiti"
    },
    {
      hindi: "“मानव सेवा ही माधव सेवा है।”",
      english: "Service to humanity is service to God — Swami Vivekananda"
    },
    {
      hindi: "“सच्चा सुख शांति में है, और शांति सेवा में है।”",
      english: "True happiness lies in inner peace, and peace lies in serving others — Spiritual Teaching"
    },
    {
      hindi: "“दूसरों के चेहरों पर मुस्कान लाना ही सबसे बड़ी पूजा है।”",
      english: "Bringing a smile to others' faces is the greatest worship — Ram Sewa Samiti"
    },
    {
      hindi: "“संस्कृति ही किसी राष्ट्र की असली पहचान होती है।”",
      english: "Culture is the true identity of any nation — Ancient Wisdom"
    },
    {
      hindi: "“दान देने से धन कम नहीं होता, बल्कि बढ़ता है।”",
      english: "Charity does not decrease wealth; rather, it multiplies it — Ancient Proverb"
    },
    {
      hindi: "“सत्य और अहिंसा के मार्ग पर चलना ही जीवन की सार्थकता है।”",
      english: "Walking on the path of truth and non-violence is the true meaning of life — Mahatma Gandhi"
    },
    {
      hindi: "“संकट के समय धैर्य और संयम ही मनुष्य की सबसे बड़ी ढाल हैं।”",
      english: "Patience and self-control are a person's greatest shield during times of crisis — Chanakya"
    },
    {
      hindi: "“जिसका मन शांत है, उसके लिए पूरा संसार शांत है।”",
      english: "For one whose mind is tranquil, the entire world is at peace — Buddha"
    },
    {
      hindi: "“भक्ति में शक्ति है और सेवा में मुक्ति है।”",
      english: "Devotion has power, and service brings liberation — Spiritual Maxim"
    },
    {
      hindi: "“सच्चा मित्र वही है जो विपत्ति में साथ दे।”",
      english: "A friend in need is a friend indeed — Ancient Proverb"
    },
    {
      hindi: "“अहंकार मनुष्य का सबसे बड़ा शत्रु है।”",
      english: "Ego is man's greatest enemy — Spiritual Teaching"
    },
    {
      hindi: "“क्षमा करने से हृदय का बोझ हल्का होता है।”",
      english: "Forgiveness lightens the burden of the heart — Moral Teaching"
    },
    {
      hindi: "“ज्ञान वही है जो मुक्ति दिलाए।”",
      english: "True knowledge is that which liberates — Upanishads"
    },
    {
      hindi: "“कर्म ही पूजा है, निष्काम कर्म ही योग है।”",
      english: "Work is worship; selfless action is true yoga — Bhagavad Gita"
    },
    {
      hindi: "“प्रकृति की सेवा करना ही ईश्वर की सच्ची आराधना है।”",
      english: "Protecting and serving nature is true worship of God — Environmental Ethics"
    },
    {
      hindi: "“दूसरों की भलाई में ही अपनी असली भलाई छिपी है।”",
      english: "Our true welfare lies in the welfare of others — Vedic Wisdom"
    },
    {
      hindi: "“हर नया दिन नई शुरुआत और नई उम्मीद लेकर आता है।”",
      english: "Every new day brings a fresh beginning and new hope — Inspirational Quote"
    },
    {
      hindi: "“सकारात्मक सोच से कठिन से कठिन परिस्थितियां भी आसान हो जाती हैं।”",
      english: "Positive thinking makes even the most difficult situations easy — Motivational Thought"
    }
  ]
};

export default settings;