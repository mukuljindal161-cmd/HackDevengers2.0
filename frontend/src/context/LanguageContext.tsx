import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

export type LanguageCode = 'en' | 'hi' | 'pa' | 'bn' | 'ta';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', flag: '🇮🇳' },
  { code: 'pa', label: 'Punjabi', nativeLabel: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'bn', label: 'Bengali', nativeLabel: 'বাংলা', flag: '🇮🇳' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்', flag: '🇮🇳' },
];

export const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en: {
    // Nav
    'nav.command_center': 'Command Center',
    'nav.graph': 'Knowledge Graph',
    'nav.discoveries': 'Discoveries',
    'nav.timeline': 'Timeline',
    'nav.query': 'Hybrid Query',
    'nav.simulate': 'What-If Simulation',
    'nav.sources': 'Sources',

    // Header
    'header.title': 'AI Intelligence Command Center',
    'header.subtitle': 'Continuously discovering consequences, schedule collisions, and hidden dependencies',
    'header.active_engine': 'Active Context Engine',
    'header.load_demo': 'Load 1-Click Demo',
    'header.processing': 'Synthesizing...',

    // Story Bar
    'storybar.badge': 'Investigation Storyline',
    'storybar.title': 'RealityGraph Demo Journey',
    'storybar.progress': 'Progress',
    'storybar.steps_completed': 'Steps',
    'storybar.reset': 'Reset',
    'storybar.step1_title': 'LOAD SCENARIO',
    'storybar.step1_desc': 'Ingest 5 fragmented notices (Exam, Main Gate, Shuttle Detour, Weather Alert).',
    'storybar.step1_btn_ready': 'Load College Demo',
    'storybar.step1_btn_done': 'Re-load Scenario',
    'storybar.step1_btn_loading': 'Processing...',
    'storybar.step1_badge_ready': 'Ready',
    'storybar.step1_badge_done': 'Loaded',

    'storybar.step2_title': 'INSPECT CONFLICTS',
    'storybar.step2_desc': 'Context engine detects Main Gate closure colliding with Route 4 exam commute.',
    'storybar.step2_btn': 'Inspect "Why?" Evidence',
    'storybar.step2_link': 'Open Discoveries Feed →',
    'storybar.step2_badge_ready': 'Critical Clash',
    'storybar.step2_badge_done': 'Inspected',

    'storybar.step3_title': 'ASK REALITYGRAPH',
    'storybar.step3_query': 'Will I miss my exam because of the current gate closure and Route 4 disruption?',
    'storybar.step3_btn': 'Query Intelligence →',
    'storybar.step3_edit': 'Edit Question',
    'storybar.step3_lock': 'Lock Question',
    'storybar.step3_badge_ready': 'Ready',
    'storybar.step3_badge_done': 'Answered',

    'storybar.step4_title': 'SIMULATE RESOLUTION',
    'storybar.step4_desc': 'Counterfactual what-if: Move exam to Sept 24 to completely resolve clashes.',
    'storybar.step4_btn_ready': 'Simulate Resolution →',
    'storybar.step4_btn_done': 'Re-run Simulation',
    'storybar.step4_badge_ready': 'Resolution Fix',
    'storybar.step4_badge_done': 'Resolved',

    // Quick Query Hero
    'quick_query.title': 'Natural-Language Intelligence Query',
    'quick_query.subtitle': 'Grounded across RAG citations & Knowledge Graph',
    'quick_query.placeholder': "Ask RealityGraph: 'What could affect my exam on September 20?', 'Explain Route 4 detour'...",
    'quick_query.button': 'Query Intelligence',
    'quick_query.suggested': 'Suggested:',

    // Query Page
    'query_page.title': 'Hybrid Context & Graph Query',
    'query_page.subtitle': 'Grounding multi-hop questions against knowledge graph and ingested notices',
    'query_page.placeholder': 'Ask RealityGraph anything about your campus context...',
    'query_page.btn': 'Synthesize Query',
    'query_page.btn_loading': 'Synthesizing with Gemini...',
    'query_page.gemini_active': 'Google Gemini Active',
    'query_page.firewall_engine': 'Hallucination Firewall Engine',
    'query_page.suggested_prompts': 'Suggested Demonstration Prompts:',
    'query_page.confidence': 'Grounding Confidence',
    'query_page.citations': 'Document Evidence Citations',
    'query_page.reasoning': 'Step-by-Step Evidence Deduction Chain',
    'query_page.connected_nodes': 'Knowledge Graph Entities',

    // Metrics & Panels
    'metrics.sources': 'Ingested Sources',
    'metrics.entities': 'Extracted Entities',
    'metrics.relationships': 'Discovered Relationships',
    'metrics.risks': 'Active Clashes & Risks',
    'panels.personalized_impact': 'Personalized Impact on You ("Impact on Me")',
    'panels.critical_contradictions': 'Critical Source Contradictions',
    'panels.recent_discoveries': 'Recent Discoveries',
    'panels.explore_graph': 'Explore Knowledge Graph',
    'why_modal.title': 'Why? — Step-by-Step Evidence Chain',
    'why_modal.close': 'Close Evidence Panel',
    'common.active_workspace': 'Active Workspace',
  },

  hi: {
    // Nav
    'nav.command_center': 'कमांड सेंटर',
    'nav.graph': 'ज्ञान ग्राफ',
    'nav.discoveries': 'खोजें व संघर्ष',
    'nav.timeline': 'समयरेखा',
    'nav.query': 'हाइब्रिड AI क्वेरी',
    'nav.simulate': 'काल्पनिक सिमुलेशन',
    'nav.sources': 'दस्तावेज़ स्रोत',

    // Header
    'header.title': 'AI इंटेलिजेंस कमांड सेंटर',
    'header.subtitle': 'विखंडित सूचनाओं से छिपे हुए संबंध, समय-संघर्ष और परिणाम उजागर करना',
    'header.active_engine': 'सक्रिय संदर्भ इंजन',
    'header.load_demo': '1-क्लिक डेमो लोड करें',
    'header.processing': 'संश्लेषण जारी...',

    // Story Bar
    'storybar.badge': 'जांच कार्यप्रवाह',
    'storybar.title': 'रियलिटीग्राफ डेमो यात्रा',
    'storybar.progress': 'प्रगति',
    'storybar.steps_completed': 'चरण पूर्ण',
    'storybar.reset': 'रीसेट',
    'storybar.step1_title': 'परिदृश्य लोड करें',
    'storybar.step1_desc': '5 विखंडित कॉलेज नोटिस (परीक्षा, मेन गेट, बस डायवर्जन, मौसम चेतावनी) लोड करें।',
    'storybar.step1_btn_ready': 'कॉलेज डेमो लोड करें',
    'storybar.step1_btn_done': 'पुनः लोड करें',
    'storybar.step1_btn_loading': 'प्रक्रियाधीन...',
    'storybar.step1_badge_ready': 'तैयार',
    'storybar.step1_badge_done': 'लोड हो गया',

    'storybar.step2_title': 'संघर्षों की जांच करें',
    'storybar.step2_desc': 'इंजन ने मुख्य द्वार बंद होने और रूट 4 परीक्षा आवागमन के टकराव का पता लगाया।',
    'storybar.step2_btn': '"क्यों?" साक्ष्य श्रृंखला देखें',
    'storybar.step2_link': 'खोज फ़ीड खोलें →',
    'storybar.step2_badge_ready': 'गंभीर टकराव',
    'storybar.step2_badge_done': 'परीक्षित',

    'storybar.step3_title': 'रियलिटीग्राफ से पूछें',
    'storybar.step3_query': 'क्या मुख्य द्वार बंद होने और रूट 4 डायवर्जन के कारण मेरी परीक्षा छूट जाएगी?',
    'storybar.step3_btn': 'इंटेलिजेंस क्वेरी करें →',
    'storybar.step3_edit': 'प्रश्न बदलें',
    'storybar.step3_lock': 'प्रश्न लॉक करें',
    'storybar.step3_badge_ready': 'तैयार',
    'storybar.step3_badge_done': 'उत्तर प्राप्त',

    'storybar.step4_title': 'समाधान सिमुलेट करें',
    'storybar.step4_desc': 'काल्पनिक वॉट-इफ़: परीक्षा को 24 सितंबर पर स्थानांतरित करके संघर्ष समाप्त करें।',
    'storybar.step4_btn_ready': 'समाधान सिमुलेट करें →',
    'storybar.step4_btn_done': 'पुनः सिमुलेशन चलाएं',
    'storybar.step4_badge_ready': 'समाधान परीक्षण',
    'storybar.step4_badge_done': 'हल हो गया',

    // Quick Query Hero
    'quick_query.title': 'प्राकृतिक भाषा इंटेलिजेंस क्वेरी',
    'quick_query.subtitle': 'RAG साक्ष्य उद्धरणों और ज्ञान ग्राफ पर पूरी तरह आधारित',
    'quick_query.placeholder': "रियलिटीग्राफ से पूछें: 'क्या 20 सितंबर को मेरी परीक्षा प्रभावित होगी?', 'रूट 4 डायवर्जन समझाइए'...",
    'quick_query.button': 'क्वेरी करें',
    'quick_query.suggested': 'सुझाव:',

    // Query Page
    'query_page.title': 'हाइब्रिड संदर्भ एवं ग्राफ क्वेरी',
    'query_page.subtitle': 'ज्ञान ग्राफ और दस्तावेज़ों के आधार पर बहु-चरणीय प्रश्नों का प्रमाणित उत्तर',
    'query_page.placeholder': 'अपने परिसर संदर्भ के बारे में रियलिटीग्राफ से कुछ भी पूछें...',
    'query_page.btn': 'क्वेरी विश्लेषित करें',
    'query_page.btn_loading': 'जेमिनी AI विश्लेषण कर रहा है...',
    'query_page.gemini_active': 'गूगल जेमिनी सक्रिय',
    'query_page.firewall_engine': 'मतिभ्रम सुरक्षा इंजन (Hallucination Firewall)',
    'query_page.suggested_prompts': 'सुझाए गए प्रदर्शन प्रश्न:',
    'query_page.confidence': 'प्रमाणीकरण विश्वास स्तर',
    'query_page.citations': 'दस्तावेज़ साक्ष्य उद्धरण',
    'query_page.reasoning': 'चरण-दर-चरण साक्ष्य श्रृंखला',
    'query_page.connected_nodes': 'संबंधित ज्ञान ग्राफ नोड्स',

    // Metrics & Panels
    'metrics.sources': 'लोड किए गए दस्तावेज़',
    'metrics.entities': 'निकाली गई संस्थाएं',
    'metrics.relationships': 'खोजी गई कड़ियाँ',
    'metrics.risks': 'सक्रिय जोखिम व टकराव',
    'panels.personalized_impact': 'आप पर व्यक्तिगत प्रभाव ("मुझ पर प्रभाव")',
    'panels.critical_contradictions': 'महत्वपूर्ण सूचना अंतर्विरोध',
    'panels.recent_discoveries': 'हालिया खोजें',
    'panels.explore_graph': 'ज्ञान ग्राफ देखें',
    'why_modal.title': 'क्यों? — चरण-दर-चरण साक्ष्य श्रृंखला',
    'why_modal.close': 'पैनल बंद करें',
    'common.active_workspace': 'सक्रिय कार्यक्षेत्र',
  },

  pa: {
    // Nav
    'nav.command_center': 'ਕਮਾਂਡ ਸੈਂਟਰ',
    'nav.graph': 'ਗਿਆਨ ਗ੍ਰਾਫ਼',
    'nav.discoveries': 'ਖੋਜਾਂ ਅਤੇ ਟਕਰਾਅ',
    'nav.timeline': 'ਸਮਾਂ-ਰੇਖਾ',
    'nav.query': 'ਹਾਈਬ੍ਰਿਡ AI ਸਵਾਲ',
    'nav.simulate': 'ਕਾਲਪਨਿਕ ਸਿਮੂਲੇਸ਼ਨ',
    'nav.sources': 'ਦਸਤਾਵੇਜ਼ ਸਰੋਤ',

    // Header
    'header.title': 'AI ਇੰਟੈਲੀਜੈਂਸ ਕਮਾਂਡ ਸੈਂਟਰ',
    'header.subtitle': 'ਵਿਖੰਡਿਤ ਜਾਣਕਾਰੀ ਤੋਂ ਲੁਕਵੇਂ ਸੰਬੰਧਾਂ ਅਤੇ ਟਕਰਾਵਾਂ ਦੀ ਖੋਜ ਕਰਨਾ',
    'header.active_engine': 'ਸਰਗਰਮ ਸੰਦਰਭ ਇੰਜਣ',
    'header.load_demo': '1-ਕਲਿੱਕ ਡੈਮੋ ਲੋਡ ਕਰੋ',
    'header.processing': 'ਪ੍ਰਕਿਰਿਆ ਜਾਰੀ...',

    // Story Bar
    'storybar.badge': 'ਜਾਂਚ ਕਾਰਜਪ੍ਰਣਾਲੀ',
    'storybar.title': 'ਰਿਐਲਿਟੀਗ੍ਰਾਫ਼ ਡੈਮੋ ਯਾਤਰਾ',
    'storybar.progress': 'ਤਰੱਕੀ',
    'storybar.steps_completed': 'ਪੜਾਅ ਪੂਰੇ',
    'storybar.reset': 'ਰੀਸੈੱਟ',
    'storybar.step1_title': 'ਦ੍ਰਿਸ਼ ਲੋਡ ਕਰੋ',
    'storybar.step1_desc': '5 ਕਾਲਜ ਨੋਟਿਸ (ਪ੍ਰੀਖਿਆ, ਮੁੱਖ ਗੇਟ, ਬੱਸ ਰੂਟ, ਮੌਸਮ ਚੇਤਾਵਨੀ) ਲੋਡ ਕਰੋ।',
    'storybar.step1_btn_ready': 'ਕਾਲਜ ਡੈਮੋ ਲੋਡ ਕਰੋ',
    'storybar.step1_btn_done': 'ਦੁਬਾਰਾ ਲੋਡ ਕਰੋ',
    'storybar.step1_btn_loading': 'ਪ੍ਰੋਸੈਸਿੰਗ...',
    'storybar.step1_badge_ready': 'ਤਿਆਰ',
    'storybar.step1_badge_done': 'ਲੋਡ ਹੋ ਗਿਆ',

    'storybar.step2_title': 'ਟਕਰਾਅ ਦੀ ਜਾਂਚ ਕਰੋ',
    'storybar.step2_desc': 'ਮੁੱਖ ਗੇਟ ਬੰਦ ਹੋਣ ਅਤੇ ਰੂਟ 4 ਪ੍ਰੀਖਿਆ ਆਵਾਜਾਈ ਦੇ ਟਕਰਾਅ ਦਾ ਪਤਾ ਲੱਗਾ।',
    'storybar.step2_btn': '"ਕਿਉਂ?" ਸਬੂਤ ਲੜੀ ਵੇਖੋ',
    'storybar.step2_link': 'ਖੋਜ ਸੂਚੀ ਖੋਲ੍ਹੋ →',
    'storybar.step2_badge_ready': 'ਗੰਭੀਰ ਟਕਰਾਅ',
    'storybar.step2_badge_done': 'ਜਾਂਚਿਆ ਗਿਆ',

    'storybar.step3_title': 'ਰਿਐਲਿਟੀਗ੍ਰਾਫ਼ ਨੂੰ ਪੁੱਛੋ',
    'storybar.step3_query': 'ਕੀ ਮੁੱਖ ਗੇਟ ਬੰਦ ਹੋਣ ਅਤੇ ਰੂਟ 4 ਦੇ ਰਸਤੇ ਬਦਲਣ ਕਾਰਨ ਮੇਰੀ ਪ੍ਰੀਖਿਆ ਛੁੱਟ ਜਾਵੇਗੀ?',
    'storybar.step3_btn': 'ਸਵਾਲ ਪੁੱਛੋ →',
    'storybar.step3_edit': 'ਸਵਾਲ ਬਦਲੋ',
    'storybar.step3_lock': 'ਸਵਾਲ ਲਾਕ ਕਰੋ',
    'storybar.step3_badge_ready': 'ਤਿਆਰ',
    'storybar.step3_badge_done': 'ਜਵਾਬ ਦਿੱਤਾ',

    'storybar.step4_title': 'ਹੱਲ ਸਿਮੂਲੇਟ ਕਰੋ',
    'storybar.step4_desc': 'ਪ੍ਰੀਖਿਆ ਨੂੰ 24 ਸਤੰਬਰ ਤੇ ਤਬਦੀਲ ਕਰਕੇ ਟਕਰਾਅ ਹੱਲ ਕਰੋ।',
    'storybar.step4_btn_ready': 'ਹੱਲ ਸਿਮੂਲੇਟ ਕਰੋ →',
    'storybar.step4_btn_done': 'ਦੁਬਾਰਾ ਚਲਾਓ',
    'storybar.step4_badge_ready': 'ਹੱਲ ਪਰਖ',
    'storybar.step4_badge_done': 'ਹੱਲ ਹੋ ਗਿਆ',

    // Quick Query Hero
    'quick_query.title': 'ਕੁਦਰਤੀ ਭਾਸ਼ਾ ਇੰਟੈਲੀਜੈਂਸ ਸਵਾਲ',
    'quick_query.subtitle': 'ਸਬੂਤਾਂ ਅਤੇ ਗਿਆਨ ਗ੍ਰਾਫ਼ ਤੇ ਪੂਰੀ ਤਰ੍ਹਾਂ ਆਧਾਰਿਤ',
    'quick_query.placeholder': "ਪੁੱਛੋ: 'ਕੀ 20 ਸਤੰਬਰ ਨੂੰ ਪ੍ਰੀਖਿਆ ਤੇ ਅਸਰ ਪਵੇਗਾ?'...",
    'quick_query.button': 'ਸਵਾਲ ਪੁੱਛੋ',
    'quick_query.suggested': 'ਸੁਝਾਅ:',

    // Query Page
    'query_page.title': 'ਹਾਈਬ੍ਰਿਡ ਸੰਦਰਭ ਅਤੇ ਗ੍ਰਾਫ਼ ਸਵਾਲ',
    'query_page.subtitle': 'ਗਿਆਨ ਗ੍ਰਾਫ਼ ਅਤੇ ਦਸਤਾਵੇਜ਼ਾਂ ਦੇ ਆਧਾਰ ਤੇ ਸਟੀਕ ਜਵਾਬ',
    'query_page.placeholder': 'ਆਪਣੇ ਕਾਲਜ ਬਾਰੇ ਰਿਐਲਿਟੀਗ੍ਰਾਫ਼ ਤੋਂ ਕੁਝ ਵੀ ਪੁੱਛੋ...',
    'query_page.btn': 'ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੋ',
    'query_page.btn_loading': 'ਜੈਮਿਨੀ AI ਜਵਾਬ ਤਿਆਰ ਕਰ ਰਿਹਾ ਹੈ...',
    'query_page.gemini_active': 'ਗੂਗਲ ਜੈਮਿਨੀ ਸਰਗਰਮ',
    'query_page.firewall_engine': 'ਸੁਰੱਖਿਅਤ AI ਇੰਜਣ',
    'query_page.suggested_prompts': 'ਸੁਝਾਏ ਗਏ ਸਵਾਲ:',
    'query_page.confidence': 'ਵਿਸ਼ਵਾਸ ਸਕੋਰ',
    'query_page.citations': 'ਦਸਤਾਵੇਜ਼ ਸਬੂਤ ਹਵਾਲੇ',
    'query_page.reasoning': 'ਕਦਮ-ਦਰ-ਕਦਮ ਸਬੂਤ ਲੜੀ',
    'query_page.connected_nodes': 'ਜੁੜੇ ਗਿਆਨ ਗ੍ਰਾਫ਼ ਨੋਡ',

    // Metrics & Panels
    'metrics.sources': 'ਸਰੋਤ ਦਸਤਾਵੇਜ਼',
    'metrics.entities': 'ਕੱਢੀਆਂ ਸੰਸਥਾਵਾਂ',
    'metrics.relationships': 'ਲੱਭੇ ਗਏ ਸੰਬੰਧ',
    'metrics.risks': 'ਸਰਗਰਮ ਖਤਰੇ ਅਤੇ ਟਕਰਾਅ',
    'panels.personalized_impact': 'ਤੁਹਾਡੇ ਉੱਤੇ ਨਿੱਜੀ ਪ੍ਰਭਾਵ',
    'panels.critical_contradictions': 'ਮਹੱਤਵਪੂਰਨ ਜਾਣਕਾਰੀ ਵਿਰੋਧਾਭਾਸ',
    'panels.recent_discoveries': 'ਤਾਜ਼ਾ ਖੋਜਾਂ',
    'panels.explore_graph': 'ਗਿਆਨ ਗ੍ਰਾਫ਼ ਵੇਖੋ',
    'why_modal.title': 'ਕਿਉਂ? — ਕਦਮ-ਦਰ-ਕਦਮ ਸਬੂਤ ਲੜੀ',
    'why_modal.close': 'ਬੰਦ ਕਰੋ',
    'common.active_workspace': 'ਸਰਗਰਮ ਵਰਕਸਪੇਸ',
  },

  bn: {
    // Nav
    'nav.command_center': 'কমান্ড সেন্টার',
    'nav.graph': 'নলেজ গ্রাফ',
    'nav.discoveries': 'আবিষ্কার ও সংঘাত',
    'nav.timeline': 'টাইমলাইন',
    'nav.query': 'হাইব্রিড AI কুয়েরি',
    'nav.simulate': 'হোয়াট-ইফ সিমুলেশন',
    'nav.sources': 'উৎস ডকুমেন্টস',

    // Header
    'header.title': 'AI ইন্টেলিজেন্স কমান্ড সেন্টার',
    'header.subtitle': 'তথ্যের মধ্যকার লুকায়িত সম্পর্ক ও সময়সূচী সংঘাত উন্মোচন করা',
    'header.active_engine': 'সক্রিয় কনটেক্সট ইঞ্জিন',
    'header.load_demo': '১-ক্লিক ডেমো লোড',
    'header.processing': 'বিশ্লেষণ চলছে...',

    // Story Bar
    'storybar.badge': 'তদন্তের রূপরেখা',
    'storybar.title': 'রিয়ালিটিগ্রাফ ডেমো জার্নি',
    'storybar.progress': 'অগ্রগতি',
    'storybar.steps_completed': 'ধাপ সম্পন্ন',
    'storybar.reset': 'রিসেট',
    'storybar.step1_title': 'দৃশ্যপট লোড করুন',
    'storybar.step1_desc': '৫টি খণ্ডিত ক্যাম্পাস নোটিশ (পরীক্ষা, গেট, বাস রুট, আবহাওয়া) লোড করুন।',
    'storybar.step1_btn_ready': 'কলেজ ডেমো লোড করুন',
    'storybar.step1_btn_done': 'পুনরায় লোড করুন',
    'storybar.step1_btn_loading': 'প্রসেসিং...',
    'storybar.step1_badge_ready': 'প্রস্তুত',
    'storybar.step1_badge_done': 'লোড হয়েছে',

    'storybar.step2_title': 'সংঘাত পরীক্ষা করুন',
    'storybar.step2_desc': 'প্রধান গেট বন্ধ এবং রুট ৪ পরীক্ষার যাতায়াত সংঘাত শনাক্ত হয়েছে।',
    'storybar.step2_btn': '"কেন?" প্রমাণের চেইন দেখুন',
    'storybar.step2_link': 'ডিসকভারি ফিড খুলুন →',
    'storybar.step2_badge_ready': 'গুরুতর সংঘাত',
    'storybar.step2_badge_done': 'পরীক্ষিত',

    'storybar.step3_title': 'রিয়ালিটিগ্রাফকে জিজ্ঞাসা করুন',
    'storybar.step3_query': 'প্রধান গেট বন্ধ এবং রুট ৪ ডাইভারশনের কারণে কি আমার পরীক্ষা মিস হবে?',
    'storybar.step3_btn': 'কুয়েরি করুন →',
    'storybar.step3_edit': 'প্রশ্ন পরিবর্তন',
    'storybar.step3_lock': 'প্রশ্ন স্থির করুন',
    'storybar.step3_badge_ready': 'প্রস্তুত',
    'storybar.step3_badge_done': 'উত্তর প্রাপ্ত',

    'storybar.step4_title': 'সমাধান সিমুলেট করুন',
    'storybar.step4_desc': 'পরীক্ষা ২৪ সেপ্টেম্বরে স্থানান্তর করে সমস্ত সংঘাত সমাধান করুন।',
    'storybar.step4_btn_ready': 'সমাধান সিমুলেট করুন →',
    'storybar.step4_btn_done': 'পুনরায় চালান',
    'storybar.step4_badge_ready': 'সমাধান যাচাই',
    'storybar.step4_badge_done': 'সমাধান হয়েছে',

    // Quick Query Hero
    'quick_query.title': 'ন্যাচারাল ল্যাঙ্গুয়েজ ইন্টেলিজেন্স কুয়েরি',
    'quick_query.subtitle': 'সরাসরি ডকুমেন্ট ও নলেজ গ্রাফের ওপর ভিত্তি করে গঠিত',
    'quick_query.placeholder': "জিজ্ঞাসা করুন: '২০ সেপ্টেম্বরের পরীক্ষায় কি কোনো ঝুঁকি আছে?'...",
    'quick_query.button': 'কুয়েরি করুন',
    'quick_query.suggested': 'পরামর্শ:',

    // Query Page
    'query_page.title': 'হাইব্রিড কনটেক্সট ও গ্রাফ কুয়েরি',
    'query_page.subtitle': 'নলেজ গ্রাফ এবং নোটিশের ভিত্তিতে সত্যনির্ভর বিশ্লেষণ',
    'query_page.placeholder': 'আপনার ক্যাম্পাস কনটেক্সট নিয়ে যেকোনো প্রশ্ন জিজ্ঞাসা করুন...',
    'query_page.btn': 'বিশ্লেষণ করুন',
    'query_page.btn_loading': 'জেমিনি AI উত্তর তৈরি করছে...',
    'query_page.gemini_active': 'গুগল জেমিনি সক্রিয়',
    'query_page.firewall_engine': 'হ্যালুসিনেশন ফায়ারওয়াল ইঞ্জিন',
    'query_page.suggested_prompts': 'প্রস্তাবিত ডেমো প্রশ্নাবলী:',
    'query_page.confidence': 'নির্ভরযোগ্যতা স্কোর',
    'query_page.citations': 'ডকুমেন্ট প্রমাণের উদ্ধৃতি',
    'query_page.reasoning': 'ধাপে ধাপে প্রমাণের চেইন',
    'query_page.connected_nodes': 'সংযুক্ত নলেজ গ্রাফ নোডস',

    // Metrics & Panels
    'metrics.sources': 'উৎস ডকুমেন্টস',
    'metrics.entities': 'চিহ্নিত এনটিটি',
    'metrics.relationships': 'আবিষ্কৃত সম্পর্ক',
    'metrics.risks': 'সক্রিয় ঝুঁকি ও সংঘাত',
    'panels.personalized_impact': 'আপনার ওপর ব্যক্তিগত প্রভাব',
    'panels.critical_contradictions': 'গুরুত্বপূর্ণ তথ্যের অসঙ্গতি',
    'panels.recent_discoveries': 'সাম্প্রতিক আবিষ্কার',
    'panels.explore_graph': 'নলেজ গ্রাফ অন্বেষণ করুন',
    'why_modal.title': 'কেন? — ধাপে ধাপে প্রমাণের চেইন',
    'why_modal.close': 'বন্ধ করুন',
    'common.active_workspace': 'সক্রিয় ওয়ার্কস্পেস',
  },

  ta: {
    // Nav
    'nav.command_center': 'கட்டளை மையம்',
    'nav.graph': 'அறிவு வரைபடம்',
    'nav.discoveries': 'கண்டுபிடிப்புகள் & முரண்பாடுகள்',
    'nav.timeline': 'காலவரிசை',
    'nav.query': 'ஹைப்ரிட் AI வினவல்',
    'nav.simulate': 'சிமுலேஷன்',
    'nav.sources': 'மூல ஆவணங்கள்',

    // Header
    'header.title': 'AI நுண்ணறிவு கட்டளை மையம்',
    'header.subtitle': 'தகவல்களுக்கு இடையிலான மறைமுக தொடர்புகள் மற்றும் மோதல்களை கண்டறிதல்',
    'header.active_engine': 'செயலில் உள்ள சூழல் பொறி',
    'header.load_demo': '1-கிளிக் டெமோ ஏற்று',
    'header.processing': 'பகுப்பாய்வு நடக்கிறது...',

    // Story Bar
    'storybar.badge': 'விசாரணை பணிப்பாய்வு',
    'storybar.title': 'ரியாலிட்டி கிராஃப் டெமோ பயணம்',
    'storybar.progress': 'முன்னேற்றம்',
    'storybar.steps_completed': 'படிகள் நிறைவுற்றன',
    'storybar.reset': 'மீட்டமைக்க',
    'storybar.step1_title': 'சூழ்நிலையை ஏற்றவும்',
    'storybar.step1_desc': '5 கல்லூரி அறிவிப்புகளை (தேர்வு, பிரதான வாயில், பேருந்து, வானிலை) ஏற்றவும்.',
    'storybar.step1_btn_ready': 'கல்லூரி டெமோ ஏற்று',
    'storybar.step1_btn_done': 'மீண்டும் ஏற்றவும்',
    'storybar.step1_btn_loading': 'செயலாக்குகிறது...',
    'storybar.step1_badge_ready': 'தயார்',
    'storybar.step1_badge_done': 'ஏற்றப்பட்டது',

    'storybar.step2_title': 'முரண்பாடுகளை ஆராயுங்கள்',
    'storybar.step2_desc': 'பிரதான வாயில் அடைப்பு மற்றும் வழித்தடம் 4 தேர்வு பயண மோதலைக் கண்டறிந்துள்ளது.',
    'storybar.step2_btn': '"ஏன்?" ஆதார சங்கிலியைப் பார்க்கவும்',
    'storybar.step2_link': 'கண்டுபிடிப்புகளுக்கு செல்லவும் →',
    'storybar.step2_badge_ready': 'தீவிர மோதல்',
    'storybar.step2_badge_done': 'ஆராயப்பட்டது',

    'storybar.step3_title': 'ரியாலிட்டி கிராஃபிடம் கேளுங்கள்',
    'storybar.step3_query': 'முதன்மை வாயில் அடைப்பு மற்றும் வழித்தடம் 4 மாற்றத்தால் எனது தேர்வு தடைபடுமா?',
    'storybar.step3_btn': 'கேள்வி கேளுங்கள் →',
    'storybar.step3_edit': 'கேள்வியை மாற்றவும்',
    'storybar.step3_lock': 'கேள்வியை பூட்டு',
    'storybar.step3_badge_ready': 'தயார்',
    'storybar.step3_badge_done': 'பதிலளிக்கப்பட்டது',

    'storybar.step4_title': 'தீர்வை சோதிக்கவும்',
    'storybar.step4_desc': 'தேர்வை செப்டம்பர் 24-க்கு மாற்றி மோதல்களை முழுமையாக தீர்க்கவும்.',
    'storybar.step4_btn_ready': 'தீர்வை சோதிக்கவும் →',
    'storybar.step4_btn_done': 'மீண்டும் இயக்கவும்',
    'storybar.step4_badge_ready': 'தீர்வு சரிபார்ப்பு',
    'storybar.step4_badge_done': 'தீர்க்கப்பட்டது',

    // Quick Query Hero
    'quick_query.title': 'இயற்கை மொழி நுண்ணறிவு வினவல்',
    'quick_query.subtitle': 'ஆவணங்கள் மற்றும் அறிவு வரைபடத்தின் அடிப்படையில் ஆதாரங்களுடன் கூடிய பதில்',
    'quick_query.placeholder': "கேளுங்கள்: 'செப்டம்பர் 20 தேர்வில் ஏதேனும் சிக்கல் உள்ளதா?'...",
    'quick_query.button': 'வினவவும்',
    'quick_query.suggested': 'பரிந்துரைகள்:',

    // Query Page
    'query_page.title': 'ஹைப்ரிட் சூழல் மற்றும் வரைபட வினவல்',
    'query_page.subtitle': 'அறிவு வரைபடம் மற்றும் ஆவணங்களின் அடிப்படையில் உண்மை அடிப்படையிலான பகுப்பாய்வு',
    'query_page.placeholder': 'உங்கள் வளாக சூழல் பற்றி எதையும் கேளுங்கள்...',
    'query_page.btn': 'பகுப்பாய்வு செய்',
    'query_page.btn_loading': 'ஜெமினி AI பதிலளிக்கிறது...',
    'query_page.gemini_active': 'கூகிள் ஜெமினி இயங்குகிறது',
    'query_page.firewall_engine': 'தவறான தகவல் தடுப்பு பொறி (Hallucination Firewall)',
    'query_page.suggested_prompts': 'பரிந்துரைக்கப்பட்ட டெமோ கேள்விகள்:',
    'query_page.confidence': 'நம்பகத்தன்மை மதிப்பீடு',
    'query_page.citations': 'ஆவண ஆதார மேற்கோள்கள்',
    'query_page.reasoning': 'படிப்படியான ஆதார சங்கிலி',
    'query_page.connected_nodes': 'இணைக்கப்பட்ட அறிவு வரைபட முனைகள்',

    // Metrics & Panels
    'metrics.sources': 'மூல ஆவணங்கள்',
    'metrics.entities': 'பிரித்தெடுக்கப்பட்ட உட்பொருட்கள்',
    'metrics.relationships': 'கண்டறியப்பட்ட உறவுகள்',
    'metrics.risks': 'செயலில் உள்ள ஆபத்துகள்',
    'panels.personalized_impact': 'உங்கள் மீதான தனிப்பட்ட தாக்கம்',
    'panels.critical_contradictions': 'முக்கிய தகவல் முரண்பாடுகள்',
    'panels.recent_discoveries': 'சமீபத்திய கண்டுபிடிப்புகள்',
    'panels.explore_graph': 'அறிவு வரைபடத்தை ஆராயுங்கள்',
    'why_modal.title': 'ஏன்? — படிப்படியான ஆதார சங்கிலி',
    'why_modal.close': 'மூடு',
    'common.active_workspace': 'செயலில் உள்ள பணியிடம்',
  },
};

interface LanguageContextValue {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
  languages: LanguageOption[];
  currentLanguageOption: LanguageOption;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = 'realitygraph_language';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && ['en', 'hi', 'pa', 'bn', 'ta'].includes(saved)) {
        return saved as LanguageCode;
      }
    }
    return 'en';
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, lang);
    }
  };

  const t = (key: string): string => {
    const langDict = TRANSLATIONS[language];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    // Fallback to English
    return TRANSLATIONS.en[key] || key;
  };

  const currentLanguageOption = useMemo(() => {
    return SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        languages: SUPPORTED_LANGUAGES,
        currentLanguageOption,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextValue => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
