export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()
    }

    load() {
        this.entries = JSON.parse(localStorage.getItem("@github-favorites:")) || []     
    }

    deleteUser(user) {
        const filteredEntries = this.entries.filter(entry => entry.login !== user.login) //returns true or false
        this.entries = filteredEntries
        this.update()
    }
}

export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)
        this.tbody = this.root.querySelector("table tbody")
        this.update()
    }

    update() {
        this.removeAllTr()
        
        this.entries.forEach( user => {
            const row = this.createRow()
            row.querySelector(".user img").src = `https://github.com/${user.login}.png`
            this.tbody.append(row)
            row.querySelector(".user img").alt = `${user.name} profile picture`
            row.querySelector(".user p").textContent = user.name
            row.querySelector(".user span").textContent = user.login
            row.querySelector(".repositories").textContent = user.public_repos
            row.querySelector(".followers").textContent = user.followers
            row.querySelector(".remove").addEventListener("click", () => {
                const isOk = confirm("Are you sure you want to delete this user?")
                if(isOk) {
                    this.deleteUser(user)
                }
            })

            }
        )
    }

    createRow() {
        const tr = document.createElement("tr")
        const content = `
            <td class="user">
                <img src="https://github.com/dadaniela.png" alt="GitHub profile picture">
                <a href="https://github.com/dadaniela" target="_blank">
                    <p>Daniela Trindade</p>
                    <span>dadaniela</span>
                </a>
            </td>
            <td class="repositories">17</td>
            <td class="followers">6</td>
            <td>
                <button class="remove">&times</button>
            </td>
        `
        tr.innerHTML = content
        return tr
    }

    removeAllTr() {
        this.tbody.querySelectorAll("tr").forEach((tr) => {
            tr.remove()
        })
    }
}