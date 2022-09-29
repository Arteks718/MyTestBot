const Telegraf = require("telegraf").Telegraf,
    os=require('node:os'),
    BOT_TOKEN = "5113931532:AAF61rNLQXK_7z5S9puv67Y9Emy5SbVizdI";

const bot = new Telegraf(BOT_TOKEN);
let data_from_server = {};
let date_of_data_from_server ="";
let switch_stats ="stats";

function getCurrentDate()
{
    var today=new Date();
    var today_day = String(today.getDate()).padStart(2,'0');
    var today_month = String(today.getMonth()+1).padStart(2,'0');
    var today_year = today.getFullYear();
    today = today_year + "-" + today_month + "-" + today_day;
    console.log(today);
    console.log(date_of_data_from_server);
    return today;
}



function getDataFromServer(forceFetch)
{
        if(!forceFetch)
        {
            return;
        }
        return fetch("https://russianwarship.rip/api/v1/statistics/latest", {
            method:"get",
            headers: {'Content-Type':'application/json'}
        })
        .then((res) => res.json())
        .then((data)=> {
            data_from_server = data;
            date_of_data_from_server = data_from_server.data.date;
            console.log("Go to server");
        })
        .catch((er)=>{
            console.log('Error: ${er}');
        })
}


bot.start(ctx=> {
    ctx.reply("Вітаємо в нашому боті!")
    ctx.replyWithHTML( "Welcome" , {
        reply_markup : {
            inline_keyboard: [
                [{text : "Get last statistic", url: "https://russianwarship.rip"}],
                [{text : "Get all by day", callback_data: "getAllByDay"}],
                [{text : "Get all statistic", callback_data: "getAll"}],
            ]
        }
    });
});

bot.action("getAllByDay", ctx=>{
    ctx.reply("Get all by day");
    switch_stats = "increase";
})

bot.action("getAll", ctx=>{
    ctx.reply("Get all");
    switch_stats = "stats";
})

bot.hears(['1','2','3'],
    ctx => ctx.reply('Цифра')
)

bot.hears(["Йоу","Hi","Привіт"], (ctx)=> ctx.reply("Вітаю у моїй таверні" + '\u{1F643}'));


bot.hears(/[A-Z]+/i, async ctx=>{
    let message = ctx.message.text;
    console.log(message);
    await getDataFromServer(date_of_data_from_server != getCurrentDate());
    ctx.reply(message + ": " + data_from_server.data[switch_stats][message]);

        // fetch("https://russianwarship.rip/api/v1/statistics/latest", {
        // method:"get",
        // headers: {'Content-Type':'application/json'}
        // })
        // .then((res) => res.json())

        // .then((data)=> {
        //     data_from_server = data;
        //     date_of_data_from_server = data_from_server.data.date;
        //     ctx.reply(message + ": " + data.data.stats[message])
        //     console.log("Go to server");
        // })
        // .catch((er)=>{
        //     console.log('Error: ${er}');
        // })

    // if (message == data_from_server[message])
    // switch (message) {
    //             case "planes": ctx.reply(message + ": " + data_from_server[message]); break;
    //             case "tanks": ctx.reply(message + ": " + data_from_server[message]); break;
    //             case "personnel_units": ctx.reply(message )
    //             default: ctx.reply("Такого ми не знаємо");
    //         } 
    // console.log(message);
         
})
        // console.log("Кількість металобрухт за весь час: ", data.data.stats.tanks, "\nМеталобрухт за день: ", data.data.increase.tanks)




bot.launch();
