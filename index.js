const Telegraf = require("telegraf").Telegraf,
    os=require('node:os'),
    BOT_TOKEN = "5113931532:AAF61rNLQXK_7z5S9puv67Y9Emy5SbVizdI";

const bot = new Telegraf(BOT_TOKEN);
let data_from_server = [];


bot.start(ctx=> {
    ctx.reply("Вітаємо в нашому боті!")
    fetch("https://russianwarship.rip/api/v1/statistics/latest", {
        method:"get",
        headers: {'Content-Type':'application/json'}
    })
        .then((res) => res.json())

        .then((data)=> {
            data_from_server = data.data.date;
        })
        .catch((err)=> ctx.reply("Problem"))
})

bot.hears(['1','2','3'],
    ctx => ctx.reply('Цифра')
)

bot.hears(["Йоу","Hi","Привіт"], (ctx)=> ctx.reply("Вітаю у моїй таверні" + '\u{1F643}'));

bot.hears(/[A-Z]+/i, (ctx)=>{
    let message = ctx.message.text;
    switch (message) {
                case "planes": ctx.reply(message + ": " + data_from_server[message]); break;
                case "tanks": ctx.reply(message + ": " + data_from_server[message]); break;
                default: ctx.reply("Такого ми не знаємо");
            } 
    console.log(message);
    
        
}
    
    
        
        // console.log("Кількість металобрухт за весь час: ", data.data.stats.tanks, "\nМеталобрухт за день: ", data.data.increase.tanks)
);



bot.launch();
