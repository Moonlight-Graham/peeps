from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes, MessageHandler, filters
from solana.rpc.async_api import AsyncClient
from solders.pubkey import Pubkey

# /start
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "🐣 Welcome, Egghead!\n\n"
        "You’ve just joined the cutest community in crypto: $PEEPS 🐥\n\n"
        "Type /help to crack open some commands."
    )

# /help
async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "🥚 $Peeps Bot Commands:\n\n"
        "/start – Welcome message from the coop\n"
        "/help – You’re lookin’ at it\n"
        "/price – Market status for $Peeps\n"
        "/contract – View token contract\n"
        "/website – Visit Peeps homepage\n"
        "/chirp – Latest tweet from the flock 🐣\n"
        "/wallet <address> – Check SOL balance of a wallet"
    )

# /price
async def price(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "🐥 $Peeps is live on Pump.fun!\n"
        "Watch the launch here:\n"
        "https://pump.fun/2faYRSrnN4Gm6orpdKCM8XsQQv3YgeZHTn5H6dknpump\n\n"
        "🚀 Let’s moon together, Eggheads!"
    )

# /contract
async def contract(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "📜 Official Solana Contract for $PEEPS:\n"
        "`2faYRSrnN4Gm6orpdKCM8XsQQv3YgeZHTn5H6dknpump`\n\n"
        "*Verified on Pump.fun* ✅",
        parse_mode="Markdown"
    )

# /website
async def website(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "🌐 Visit our official homepage:\n"
        "https://www.peepssolana.com\n\n"
        "✨ Built by Eggheads, for Eggheads."
    )

# /chirp
async def chirp(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "📣 Latest chirp from the coop:\n\n"
        "🐣 $PEEPS is taking flight with Pump.fun!\n"
        "Join the revolution, Eggheads 🥚\n\n"
        "👉 https://twitter.com/peepssolana"
    )

# /wallet <address>
async def wallet(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if len(context.args) == 0:
        await update.message.reply_text("⚠️ Please provide your Solana wallet address.\nExample:\n/wallet 3B2kG7...Fvz")
        return

    address = context.args[0]
    try:
        public_key = Pubkey.from_string(address)
        async with AsyncClient("https://api.mainnet-beta.solana.com") as client:
            response = await client.get_balance(public_key)
            sol = response.value / 1e9
            await update.message.reply_text(
                f"🔐 Wallet `{address}` connected!\n"
                f"💰 Balance: {sol:.4f} SOL",
                parse_mode="Markdown"
            )
    except Exception as e:
        await update.message.reply_text("❌ Invalid address or RPC error. Please try again.")

# Welcome new members
async def welcome(update: Update, context: ContextTypes.DEFAULT_TYPE):
    for user in update.message.new_chat_members:
        name = user.first_name
        await update.message.reply_text(
            f"👋 Welcome to the Coop, {name}!\n\n"
            f"You’re officially an Egghead now 💛🥚\n"
            f"Type /help to get started or visit https://www.peepssolana.com"
        )

# Bot setup
app = ApplicationBuilder().token("7751534904:AAFalxBIclkSEiCkTKdt9iLK4zAP1WVdm_A").build()

# Register command handlers
app.add_handler(CommandHandler("start", start))
app.add_handler(CommandHandler("help", help_command))
app.add_handler(CommandHandler("price", price))
app.add_handler(CommandHandler("contract", contract))
app.add_handler(CommandHandler("website", website))
app.add_handler(CommandHandler("chirp", chirp))
app.add_handler(CommandHandler("wallet", wallet))

# Register welcome message
app.add_handler(MessageHandler(filters.StatusUpdate.NEW_CHAT_MEMBERS, welcome))

print("🐣 $Peeps Bot is now running! Cluck cluck.")
app.run_polling()
