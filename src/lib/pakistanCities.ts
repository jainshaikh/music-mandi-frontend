// Major Pakistani cities grouped by province/region, for the campaign
// builder's city picker. Not exhaustive — covers the cities an advertiser is
// realistically targeting.
export const PAKISTAN_CITIES: { region: string; cities: string[] }[] = [
  {
    region: "Punjab",
    cities: [
      "Lahore",
      "Faisalabad",
      "Rawalpindi",
      "Multan",
      "Gujranwala",
      "Sialkot",
      "Bahawalpur",
      "Sargodha",
      "Sheikhupura",
      "Jhang",
      "Rahim Yar Khan",
      "Gujrat",
      "Kasur",
      "Okara",
      "Sahiwal",
      "Wah Cantonment",
    ],
  },
  {
    region: "Sindh",
    cities: [
      "Karachi",
      "Hyderabad",
      "Sukkur",
      "Larkana",
      "Nawabshah",
      "Mirpur Khas",
      "Jacobabad",
      "Shikarpur",
    ],
  },
  {
    region: "Khyber Pakhtunkhwa",
    cities: [
      "Peshawar",
      "Mardan",
      "Mingora",
      "Kohat",
      "Abbottabad",
      "Dera Ismail Khan",
      "Bannu",
      "Swabi",
    ],
  },
  {
    region: "Balochistan",
    cities: ["Quetta", "Turbat", "Khuzdar", "Sibi", "Gwadar", "Chaman"],
  },
  {
    region: "Islamabad Capital Territory",
    cities: ["Islamabad"],
  },
  {
    region: "Azad Kashmir",
    cities: ["Muzaffarabad", "Mirpur", "Rawalakot"],
  },
  {
    region: "Gilgit-Baltistan",
    cities: ["Gilgit", "Skardu"],
  },
];

export const ALL_PAKISTAN_CITIES: string[] = PAKISTAN_CITIES.flatMap(
  (group) => group.cities,
);
