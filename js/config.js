/**
 * Product and public-site configuration.
 * Replace the example product paths when the definitive frontend routes exist.
 */
window.LENDUP_CONFIG = Object.freeze({
  APP_URL: "https://app.lendup.pe",
  EXPLORE_URL: "https://app.lendup.pe/explore",
  PUBLISH_URL: "https://app.lendup.pe/my-items/new",
  SITE_URL: "https://TU-DOMINIO.com",
  ABOUT_PRODUCT_YOUTUBE_ID: "",
  ABOUT_TEAM_YOUTUBE_ID: "",
  SOCIAL_LINKS: Object.freeze({
    github: "https://github.com/UPC-1ASI0657-202620-9222-LendUp",
    youtube: "",
    instagram: "",
    linkedin: ""
  })
});

/**
 * Official photo mapping: integrante1 Braden, 2 Eduardo, 3 Fabricio,
 * 4 Anderson, 5 Victor, 6 Juan. Position controls only the CSS square crop.
 */
window.LENDUP_TEAM = [
  { name: "Chacaliaza Minaya, Eduardo Fabian", initials: "EC", image: "assets/team/eduardo-chacaliaza.webp", position: "50% 25%" },
  { name: "Quispe Barzola, Fabricio Fabian", initials: "FQ", image: "assets/team/fabricio-quispe.webp", position: "50% 50%" },
  { name: "Garcia Cerpa, Braden Raid", initials: "BG", image: "assets/team/braden-garcia.webp", position: "50% 35%" },
  { name: "Espino Rossi, Victor Manuel", initials: "VE", image: "assets/team/victor-espino.webp", position: "50% 50%" },
  { name: "Ventosilla Trujillo, Anderson Ricardo", initials: "AV", image: "assets/team/anderson-ventosilla.webp", position: "50% 40%" },
  { name: "Orosco Ttamiña, Juan Carlos", initials: "JC", image: "assets/team/juan-orosco.webp", position: "50% 20%" }
];
