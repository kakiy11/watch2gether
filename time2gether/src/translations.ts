

export type Language = 'English' | 'Spanish' | 'French' | 'German' | 'Russian';

export interface Translations {
  home: string;
  language: string;
  help: string;
  createYourRoom: string;
  createRoom: string;
  createAnotherRoom: string;
  shareLink: string;
  copy: string;
  roomCreated: string;
  step1: string;
  step2: string;
  step3: string;
  profileSettings: string;
  watchHistory: string;
  signOut: string;
  roomLinkCopied: string;
  failedToCopy: string;
  languageChanged: string;
  howToCreateRoom: string;
  troubleshooting: string;
  faq: string;
  contactSupport: string;
}

export const translations: Record<Language, Translations> = {
  English: {
    home: 'home',
    language: 'language',
    help: 'help',
    createYourRoom: 'create your room',
    createRoom: 'Create Room',
    createAnotherRoom: 'Create Another Room',
    shareLink: 'Share Link',
    copy: 'Copy',
    roomCreated: '🎉 Room Created! 🎉',
    step1: 'Create a room',
    step2: 'Share the link',
    step3: 'Enjoy',
    profileSettings: 'Profile Settings',
    watchHistory: 'Watch History',
    signOut: 'Sign Out',
    roomLinkCopied: 'Link copied to clipboard!',
    failedToCopy: 'Failed to copy link. Please copy manually.',
    languageChanged: 'Language changed to',
    howToCreateRoom: 'How to create a room',
    troubleshooting: 'Troubleshooting',
    faq: 'FAQ',
    contactSupport: 'Contact support',
  },
  Spanish: {
    home: 'inicio',
    language: 'idioma',
    help: 'ayuda',
    createYourRoom: 'crea tu sala',
    createRoom: 'Crear Sala',
    createAnotherRoom: 'Crear Otra Sala',
    shareLink: 'Compartir Enlace',
    copy: 'Copiar',
    roomCreated: '🎉 Sala Creada! 🎉',
    step1: 'Crear una sala',
    step2: 'Compartir el enlace',
    step3: 'Disfrutar',
    profileSettings: 'Configuración de Perfil',
    watchHistory: 'Historial',
    signOut: 'Cerrar Sesión',
    roomLinkCopied: '¡Enlace copiado al portapapeles!',
    failedToCopy: 'Error al copiar el enlace. Copia manualmente.',
    languageChanged: 'Idioma cambiado a',
    howToCreateRoom: 'Cómo crear una sala',
    troubleshooting: 'Solucionar problemas',
    faq: 'Preguntas frecuentes',
    contactSupport: 'Contactar soporte',
  },
  French: {
    home: 'accueil',
    language: 'langue',
    help: 'aide',
    createYourRoom: 'créez votre salle',
    createRoom: 'Créer une Salle',
    createAnotherRoom: 'Créer une Autre Salle',
    shareLink: 'Partager le Lien',
    copy: 'Copier',
    roomCreated: '🎉 Salle Créée! 🎉',
    step1: 'Créer une salle',
    step2: 'Partager le lien',
    step3: 'Profiter',
    profileSettings: 'Paramètres du Profil',
    watchHistory: 'Historique',
    signOut: 'Déconnexion',
    roomLinkCopied: 'Lien copié dans le presse-papiers!',
    failedToCopy: 'Échec de la copie. Copiez manuellement.',
    languageChanged: 'Langue changée en',
    howToCreateRoom: 'Comment créer une salle',
    troubleshooting: 'Dépannage',
    faq: 'FAQ',
    contactSupport: 'Contacter le support',
  },
  German: {
    home: 'startseite',
    language: 'sprache',
    help: 'hilfe',
    createYourRoom: 'erstellen Sie Ihren Raum',
    createRoom: 'Raum Erstellen',
    createAnotherRoom: 'Weiteren Raum Erstellen',
    shareLink: 'Link Teilen',
    copy: 'Kopieren',
    roomCreated: '🎉 Raum Erstellt! 🎉',
    step1: 'Raum erstellen',
    step2: 'Link teilen',
    step3: 'Genießen',
    profileSettings: 'Profileinstellungen',
    watchHistory: 'Verlauf',
    signOut: 'Abmelden',
    roomLinkCopied: 'Link in die Zwischenablage kopiert!',
    failedToCopy: 'Kopieren fehlgeschlagen. Bitte manuell kopieren.',
    languageChanged: 'Sprache geändert zu',
    howToCreateRoom: 'Wie erstelle ich einen Raum',
    troubleshooting: 'Fehlerbehebung',
    faq: 'FAQ',
    contactSupport: 'Support kontaktieren',
  },
  Russian: {
    home: 'главная',
    language: 'язык',
    help: 'помощь',
    createYourRoom: 'создать комнату',
    createRoom: 'Создать комнату',
    createAnotherRoom: 'Создать другую комнату',
    shareLink: 'Поделиться ссылкой',
    copy: 'Копировать',
    roomCreated: '🎉 Комната создана! 🎉',
    step1: 'Создать комнату',
    step2: 'Поделиться ссылкой',
    step3: 'Наслаждаться',
    profileSettings: 'Настройки профиля',
    watchHistory: 'История просмотров',
    signOut: 'Выйти',
    roomLinkCopied: 'Ссылка скопирована!',
    failedToCopy: 'Не удалось скопировать. Скопируйте вручную.',
    languageChanged: 'Язык изменен на',
    howToCreateRoom: 'Как создать комнату',
    troubleshooting: 'Устранение проблем',
    faq: 'Часто задаваемые вопросы',
    contactSupport: 'Связаться с поддержкой',
  },
};