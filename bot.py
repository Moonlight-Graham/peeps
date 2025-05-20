from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes, MessageHandler, filters
from solana.rpc.async_api import AsyncClient
from solders.pubkey import Pubkey


# /start
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "🐣 Welcome, Egghead!\n\n"
        "You’ve just joined the cutest community in crypto: $Peeps 🐥\n\n"
        "Type /help to crack open some commands."
    )

# /help
async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "🥚 $Peeps Bot Commands:\n\n"
        "/start - Welcome message from the coop\n"
        "/help - You’re lookin’ at it\n"
        "/price - Market status for $Peeps\n"
        "/contract - View token address\n"
        "/website - Visit Peeps homepage\n"
        "/chirp - Latest tweet from the flock 🐤\n"
        "/wallet <address> - Check SOL balance of a wallet"
    )

# /price
async def price(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "📊 $Peeps is still hatching... no live price yet!\n"
        "But when this chick flies, it’s moonbound. 🚀🌕"
    )

# /contract
async def contract(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "📜 Official Solana Contract for $Peeps:\n"
        "`8DFkuXQWU85VtpVzfw914YTU2ePNchdk9au58gMJb3W2`\n\n"
        "*Verified and eggcellent.* 🥚✅",
        parse_mode="Markdown"
    )

# /website
async def website(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "🌐 Visit our official site:\nhttps://www.peepssolana.com\n\n"
        "🚧 Built by Eggheads, for Eggheads."
    )

# /chirp
async def chirp(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "🐥 Latest chirp from the coop:\n\n"
        "🚀 $Peeps is live on Solana and making waves!\n"
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
                f"📬 Wallet `{address}` connected!\n"
                f"💰 Balance: {sol:.4f} SOL",
                parse_mode="Markdown"
            )
    except Exception as e:
        await update.message.reply_text("❌ Invalid address or RPC error. Please try again.")

# Greet new Eggheads
async def welcome(update: Update, context: ContextTypes.DEFAULT_TYPE):
    for user in update.message.new_chat_members:
        name = user.first_name
        await update.message.reply_text(
            f"🐣 Welcome to the Coop, {name}!\n"
            f"You’re officially an Egghead now 💛\n\n"
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

print("🐥 $Peeps Bot is now running! Cluck cluck.")
app.run_polling()
