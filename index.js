const { writeFileSync } = require("fs");
const { createEvents } = require("ics");

const scheduleRawJson = require("./data/schedule.json");

const schedules = {
    "apple": [],
    "other": []
};
for (const i in scheduleRawJson) {
    for (const e of scheduleRawJson[i]) {
        const dateSplit = e["date"].split(".");

        const obj = {
            calName: "Sirius University",

            title: `${e["discipline"]} (${e["groupType"]})`,

            organizer: {
                name: Object.values(e["teachers"])[0]["fio"],
                email: "info@siriusuniversity.ru"
            },

            location: e["classroom"],

            start: [dateSplit[2], dateSplit[1], dateSplit[0], ...e["startTime"].split(":")]
                .map((d) => { return parseInt(d) }),
            end: [dateSplit[2], dateSplit[1], dateSplit[0], ...e["endTime"].split(":")]
                .map((d) => { return parseInt(d) }),
        }

        schedules.apple.push(obj);

        obj.description = `Преподаватель: ${Object.values(e["teachers"])[0]["fio"]}`;
        schedules.other.push(obj);
    }
}

for (const s in schedules) {
    const { error, value } = createEvents(schedules[s]);
    if (error) throw error;

    writeFileSync(`${__dirname}/schedule_${s}.ics`, value);
}