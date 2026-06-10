export const prodeMatchesMock = [
  {
    id: 1,
    homeTeam: "Argentina",
    awayTeam: "Brasil",
    matchDate: "2026-06-10",
    matchTime: "16:00",
    status: "open",
    prediction: {
      homeGoals: "",
      awayGoals: "",
    },
    result: {
      homeGoals: null,
      awayGoals: null,
    },
    pointsEarned: 0,
  },
  {
    id: 2,
    homeTeam: "Francia",
    awayTeam: "Alemania",
    matchDate: "2026-06-11",
    matchTime: "18:00",
    status: "locked",
    prediction: {
      homeGoals: 1,
      awayGoals: 2,
    },
    result: {
      homeGoals: null,
      awayGoals: null,
    },
    pointsEarned: 0,
  },
  {
    id: 3,
    homeTeam: "España",
    awayTeam: "Italia",
    matchDate: "2026-06-08",
    matchTime: "15:00",
    status: "finished",
    prediction: {
      homeGoals: 2,
      awayGoals: 1,
    },
    result: {
      homeGoals: 2,
      awayGoals: 1,
    },
    pointsEarned: 100,
  },
];