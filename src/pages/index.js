import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";
import { GithubIcon, SearchIcon, SettingsIcon } from "@/components/iconos";
import SettingsModal from "@/components/settingsModal";
import UserPreferences from "@/utils/UserPreferences";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [pageRank, setPageRank] = useState({});
  const [error, setError] = useState(null);
  const [recomendations, setRecomendations] = useState([]);
  const [inputSearch, setInputSearch] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const userPreferences = new UserPreferences();
  // const [theme, setTheme] = useState("dark");

  useEffect(() => {
    let topicsPreferences = null;
    if (userPreferences.anyTopicSelected()) {
      topicsPreferences = userPreferences.getTopicsPreferences();
      topicsPreferences = JSON.stringify(topicsPreferences);
    }
    fetch("/api/pageRank", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        topicsPreferences: topicsPreferences,
      },
    })
      .then((res) => res.json())
      .then((data) => setRecomendations(data.pageRank.slice(0, 5)));

    if (!localStorage.getItem("topicsPreferences")) {
      setShowSettings(true);
    }

    // if (localStorage.getItem("theme")) {
    //   setTheme(localStorage.getItem("theme"));
    // }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = e.target.query.value.trim();
    let topicsPreferences = null;
    if (userPreferences.anyTopicSelected()) {
      topicsPreferences = userPreferences.getTopicsPreferences();
      topicsPreferences = JSON.stringify(topicsPreferences);
    }
    if (query) {
      fetch(`/api/pageRank?query=${query}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          topicsPreferences: topicsPreferences,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setPageRank(data);
          if (data.pageRank.length === 0) {
            setError("No results found, try another query...");
          } else {
            setError(null);
          }
        });
    }
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    setInputSearch(value);
    if (!value) {
      setPageRank({});
    }
  };

  const handleThemeChange = (e) => {
    const { value } = e.target;
    setTheme(value);
    localStorage.setItem("theme", value);
    // change the prefers-color-scheme when the user clicks on the button
  };

  return (
    <>
      <Head>
        <title>JoGui</title>
        <meta
          name="description"
          content="JoGui.Net is a search engine PageRank based"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.fixedButtons}>
          <button
            className={styles.settingButton}
            onClick={() => setShowSettings(true)}
          >
            <SettingsIcon />
          </button>
          {/* <button
            className={styles.settingButton}
            title="Change Theme"
            value={theme === "dark" ? "light" : "dark"}
            onClick={handleThemeChange}
          >
            {theme === "dark" ? "🌚" : "🌞"}
          </button> */}
          <Link
            className={styles.settingButton}
            href="https://github.com/JoseGomez14/page-rank"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GithubIcon />
          </Link>
        </div>
        <div className={styles.center}>
          <Image
            className={styles.logo}
            src="/next.svg"
            alt="Next.js Logo"
            width={180}
            height={37}
            priority
          />
        </div>
        <form className={styles.search} onSubmit={handleSubmit}>
          <input
            id="query"
            name="query"
            value={inputSearch}
            onChange={handleInputChange}
            className={styles.input}
            type="text"
            placeholder="Search..."
            autoComplete="off"
          />
          <button className={styles.button} type="submit" title="Search">
            <SearchIcon />
          </button>
        </form>
        <br />
        <div className={styles.grid}>
          {pageRank.pageRank ? (
            <>
              {error && <p className={inter.className}>{error}</p>}

              {pageRank.pageRank.length > 0 && (
                <h2 className={inter.className}>
                  {pageRank.pageRank.length} Result
                  {pageRank.pageRank.length === 1 ? "" : "s"}, in{" "}
                  {pageRank.time.toFixed(4)} seconds, with {pageRank.iterations}{" "}
                  iterations
                </h2>
              )}
              {pageRank.pageRank.map(({ value, title, description }, index) => (
                <div key={index} className={styles.card}>
                  <h2 className={inter.className}>{title}</h2>
                  <p className={inter.className}>{description}</p>
                  <p className={inter.className}>PR: {value.toFixed(4)}</p>
                </div>
              ))}
            </>
          ) : (
            recomendations.length > 0 && (
              <>
                <h2 className={inter.className}>Recomended Pages</h2>
                {recomendations.map(({ value, title, description }, index) => (
                  <div key={index} className={styles.card}>
                    <h2 className={inter.className}>{title}</h2>
                    <p className={inter.className}>{description}</p>
                    <p className={inter.className}>PR: {value.toFixed(4)}</p>
                  </div>
                ))}
              </>
            )
          )}
        </div>
        <SettingsModal show={showSettings} setShow={setShowSettings} />
      </main>
    </>
  );
}
