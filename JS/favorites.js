import { GithubUser } from "./githubUser.js"

export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()
    }

    load() {
        this.entries = JSON.parse(localStorage.getItem("@github-favorites")) || []     
    }

    save() {
        localStorage.setItem("@github-favorites", JSON.stringify(this.entries))
    }

    async add(username) {
        try {
            const userExists = this.entries.find(entry => entry.login === username)
            if(userExists) {
                throw new Error("User already favorited")
            }

            const user = await GithubUser.search(username)
            if(user.login === undefined) {
                throw new Error ("User not found")
            }
            this.entries = [user, ...this.entries] //adds the last user searched on top of the other previous entries in this new array
            this.update()
            this.save()
        } catch(error) {
            alert(error.message)
        }
        
    }

    deleteUser(user) {
        const filteredEntries = this.entries.filter(entry => entry.login !== user.login) //returns true or false
        this.entries = filteredEntries
        this.update()
        this.save()
    }
}

export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)
        this.tbody = this.root.querySelector("table tbody")
        this.update()
        this.onAdd()
    }

    onAdd() {
        const addButton = this.root.querySelector(".search button")
        addButton.onclick = () => {
            const { value } = this.root.querySelector(".search input")
            this.add(value)
        }
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
            row.querySelector(".user a").href = `https://github.com/${user.login}`
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