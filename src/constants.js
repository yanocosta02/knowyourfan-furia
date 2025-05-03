// src/constants.js

export const teamOptions = [
    "FURIA", "LOUD", "paiN Gaming", "MIBR", "Imperial Esports", "Fluxo",
    "RED Canids Kalunga", "INTZ", "Vivo Keyd Stars", "FaZe Clan", "Natus Vincere (NAVI)",
    "G2 Esports", "Team Vitality", "MOUZ", "Team Liquid", "Complexity", "Heroic",
    "Astralis", "Ninjas in Pyjamas (NIP)", "Cloud9"
    // Adicione mais se desejar
];

export const gameSuggestionsData = [
    'Counter-Strike 2', 'Valorant', 'League of Legends', 'Dota 2', 'Apex Legends',
    'Rainbow Six Siege', 'Overwatch 2', 'PUBG', 'Fortnite', 'Rocket League',
    'Free Fire', 'Mobile Legends', 'Arena of Valor', 'Call of Duty: Warzone', 'Minecraft',
    'Grand Theft Auto V', 'World of Warcraft', 'Final Fantasy XIV'
];

export const eventSuggestionsData = [
    'IEM Cologne', 'IEM Katowice', 'BLAST Premier World Final', 'BLAST Premier Spring/Fall Groups/Finals',
    'VCT Champions', 'VCT Masters (Madrid/Shanghai/etc)', 'VCT Americas/EMEA/Pacific/China Kickoff/Stage 1/Stage 2',
    'LCS Finals', 'LEC Finals', 'LCK Finals', 'LPL Finals', 'MSI (Mid-Season Invitational)', 'Worlds (League of Legends)',
    'The International (Dota 2)', 'Six Invitational (R6)', 'Six Major (R6)', 'PGL Major (CS2)', 'ESL Pro League (CS2)',
    'Gamers8', 'Esports World Cup', 'DreamHack', 'Evo (Fighting Games)'
];

// Mantendo activityOptions caso use em outro lugar ou nos badges
export const activityOptions = [
    "Assistir streams na Twitch", "Assistir vídeos no YouTube (gameplay, tutoriais)",
    "Participar de comunidades no Discord", "Seguir pro players/times nas redes sociais",
    "Ler notícias sobre esports/games", "Ouvir podcasts sobre esports/games",
    "Jogar partidas casuais/ranqueadas", "Participar de campeonatos amadores",
    "Criar conteúdo (stream, vídeo, artigo)", "Apostar em partidas (onde legalizado)",
    "Colecionar itens digitais (skins, etc.)", "Interagir em fóruns (Reddit, etc.)"
];


export const purchaseSuggestionsData = [
    'Cadeira Gamer', 'Mouse Gamer', 'Teclado Mecânico', 'Headset Gamer',
    'Monitor 144Hz', 'Monitor 240Hz', 'Mousepad Gamer', 'Placa de Vídeo',
    'Webcam', 'Microfone', 'Skin CS2', 'Skin Valorant', 'Skin LoL', 'Skin Dota 2',
    'Passe de Batalha', 'Gift Card Steam', 'Jogo na Steam', 'Jogo Epic Games',
    'Assinatura Twitch', 'Bits Twitch', 'Merchandising FURIA', 'Ingresso Evento Esports'
];


export const badgeDefinitions = [
    // Badges de Times
    { id: 'furia_fan', name: 'Torcedor FURIA', criteria: (data) => data.favoriteTeams?.includes('FURIA'), icon: '🐾' },
    { id: 'loud_fan', name: 'Torcedor LOUD', criteria: (data) => data.favoriteTeams?.includes('LOUD'), icon: ' L ' },
    { id: 'pain_fan', name: 'Torcedor paiN', criteria: (data) => data.favoriteTeams?.includes('paiN Gaming'), icon: ' P ' },
    { id: 'mibr_fan', name: 'Torcedor MIBR', criteria: (data) => data.favoriteTeams?.includes('MIBR'), icon: ' M '},
    // Badges de Jogos
    { id: 'cs_player', name: 'Fã de CS', criteria: (data) => data.interests?.some(i => i.toLowerCase().includes('counter-strike') || i.toLowerCase().includes('cs2')), icon: '🎯' },
    { id: 'lol_player', name: 'Fã de LoL', criteria: (data) => data.interests?.some(i => i.toLowerCase().includes('league of legends')), icon: '⚔️' },
    { id: 'valorant_player', name: 'Fã de Valorant', criteria: (data) => data.interests?.some(i => i.toLowerCase().includes('valorant')), icon: '🔫' },
    // Badges de Atividades (usando activitiesLastYear como array)
    { id: 'stream_viewer', name: 'Vê Streams', criteria: (data) => data.activitiesLastYear?.includes('Assistir streams na Twitch'), icon: '📺' },
    { id: 'community_member', name: 'Da Comunidade', criteria: (data) => data.activitiesLastYear?.includes('Participar de comunidades no Discord') || data.activitiesLastYear?.includes('Interagir em fóruns (Reddit, etc.)'), icon: '💬' },
    // Badges de Engajamento/Perfil
    { id: 'event_enthusiast', name: 'Vê Eventos', criteria: (data) => (data.eventsLastYear?.length || 0) >= 2, icon: '🏆' }, // Ex: >= 2 eventos
    { id: 'gear_head', name: 'Gear Head', criteria: (data) => data.purchasesLastYear?.some(p => p.toLowerCase().includes('gamer') || p.toLowerCase().includes('mecânico') || p.toLowerCase().includes('hz')), icon: '⚙️' },
    { id: 'socially_connected', name: 'Conectado', criteria: (data, linked) => linked.length >= 2, icon: '🔗' }, // Usa linkedProviders
    { id: 'verified_fan', name: 'Verificado', criteria: (data) => data.idValidated === true, icon: '✔️' },
    { id: 'steam_linked', name: 'Tem Steam', criteria: (data) => !!data.steamNickname, icon: '🎮' },
];