const { writeFileSync } = require("fs");
const { createEvents } = require("ics");
const sirinium = require("sirinium");

const client = new sirinium.Client();

const schedules = {
    "apple": [],
    "other": []
};

const generate = async () => {
    await client.getInitialData();

    const schedule = await client.getGroupSchedule(process.env.SCHEDULE_GROUP ?? "К0609-24");

    for (const i of schedule) {
        const dateSplit = i["date"].split(".");

        const teacherName =
            Object.values(i["teachers"]).length !== 0 ? Object.values(i["teachers"])[0]["fio"] : "–";

        const obj = {
            calName: "Sirius University",

            title: `${i["discipline"]} (${i["groupType"]})`,

            organizer: {
                name: teacherName,
                email: "info@siriusuniversity.ru"
            },

            location: i["classroom"],

            start: [dateSplit[2], dateSplit[1], dateSplit[0], ...i["startTime"].split(":")]
                .map((d) => { return parseInt(d) }),
            end: [dateSplit[2], dateSplit[1], dateSplit[0], ...i["endTime"].split(":")]
                .map((d) => { return parseInt(d) }),
        }

        schedules.apple.push(obj);

        obj.description = `Преподаватель: ${teacherName}`;
        schedules.other.push(obj);
    }

    for (const s in schedules) {
        const { error, value } = createEvents(schedules[s]);
        if (error) throw error;

        writeFileSync(`${__dirname}/schedule_${s}.ics`, value);
    }
}

generate().then(() => console.log("Generation finished!"));