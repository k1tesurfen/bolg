import React, { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

function App() {
  const [ip, setIp] = useState("");
  const [url, setUrl] = useState("");
  const [returnMessage, setReturnMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  // Use useEffect to clear messages after 5 seconds
  React.useEffect(() => {
    if (returnMessage) {
      setIsVisible(true);
      setTimeout(() => {
        setIsVisible(false);
        setReturnMessage("");
      }, 5000);
    }
  }, [returnMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let content = "";
    // Check if both IP and URL are provided
    if (!ip && url) {
      // Combine IP and URL into the required format
      content = `192.168.1.171 ${url}`;
    } else if (ip && !url) {
      content = `${ip} ki.artismedia.de`;
    } else if (!ip && !url) {
      content = `192.168.1.171 ki.artismedia.de`;
    } else {
      content = `${ip} ${url}`;
    }

    // Combine IP and URL into the required format

    try {
      // Call the Rust function to write the content to /etc/hosts
      await invoke("write_to_hosts", { content });
      setReturnMessage("DNS-Eintrag erfolgreich hinzugefügt.");
    } catch (error) {
      setReturnMessage(
        "Beim Schreiben in /etc/hosts ist ein Fehler aufgetreten. Bitte versuche es erneut.",
      );
      console.error("Failed to write to /etc/hosts:", error);
    }
  };

  return (
    <main className="container">
      <h1>
        WRITE<span>2</span>HOSTS
      </h1>

      <div className="text">
        <p>
          Schreibe neue DNS-Einträge in deine lokale Hosts-Datei. Neue Einträge
          werden am Ende von /etc/hosts angefügt.
        </p>
      </div>

      <form className="" onSubmit={handleSubmit}>
        <div className="row">
          <input
            id="ip-input"
            onChange={(e) => setIp(e.target.value)}
            placeholder="192.168.1.171 ..."
          />
          <div className="arrow">
            <p>---&gt;</p>
          </div>
          <input
            id="url-input"
            onChange={(e) => setUrl(e.target.value)}
            placeholder="ki.artismedia.de ..."
          />
        </div>
        <div className="submit-container">
          <button className="final-button" type="submit">
            Eintragen
          </button>
        </div>
        {isVisible && <div className="alert">{returnMessage}</div>}
      </form>
    </main>
  );
}

export default App;
