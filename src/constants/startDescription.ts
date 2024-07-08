export default String.raw`
Hello, I'm <b>skrippy</b> 👋
Here you can see list of my commands (required role is presented in square brackets []):

/start — commands' description [USER]

<i>---- CONTROL USERS ----</i>
/users — show list of bot's users and their roles [ADMIN]
/op {USERNAME} — assign user an admin role [HOST]
/add {USERNAME} — assign user an user role [ADMIN]
/remove {USERNAME} — remove user [ADMIN]

<i>---- CONTROL MUSIC ----</i>
/order {YOUTUBE_URL} — order track with url [USER]
/skip — skip current track [ADMIN]
/clear — clear playlist & stop playing music [ADMIN]
/list — show playlist & see current track [USER]

Well, we can start with /order 😉
`
