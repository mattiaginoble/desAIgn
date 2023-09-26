import { useState } from "react";
import * as Networker from "monorepo-networker";
import { NetworkMessages } from "@common/network/messages";
import { htmlToFigma } from "@builder.io/html-to-figma";

import Wave from "@ui/assets/wave.svg?component";

const deriveIframeFromHtml = (html: string) => {
  const iframe = document.createElement("iframe");
  document.body.appendChild(iframe);
  iframe.contentWindow?.document.open();
  iframe.contentWindow?.document.write(html);
  iframe.contentWindow?.document.close();

  return iframe;
};

function App() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [htmlCode, setHtmlCode] = useState("");

  const askGPT = async () => {
    try {
      setLoading(true);

      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      };

      const res = await fetch("http://localhost:3000/ask", requestOptions);

      if (!res.ok) {
        throw new Error("Something went wrong");
      }

      const data = await res.json();

      console.log("Json response", JSON.stringify(data));

      const { message: htmlString } = data;

      setHtmlCode(htmlString);
    } catch (err) {
      console.error(err, "err");
    } finally {
      setLoading(false);
    }
  };

  const applyHTML = () => {
    if (!htmlCode) {
      return;
    }

    const iframe = deriveIframeFromHtml(htmlCode);
    const layers = htmlToFigma(iframe.contentWindow?.document.body, true);

    console.log("Converted layers", JSON.stringify(layers));

    NetworkMessages.CREATE_RECT.send({
      layers,
    });
  };

  return (
    <>
      <div className="header">
        <h1>desAIgn</h1>
        <h3>Get magical designs through AI</h3>
        <div style={{ marginTop: "3em" }}>
          <Wave />
        </div>
      </div>

      <div className="home">
        <textarea
          className="textarea"
          rows={6}
          placeholder="Generate an HTML webpage"
          style={{ marginTop: "2em" }}
          maxLength={400}
          onChange={(e) => setPrompt(e.target.value)}
          value={prompt}
        />
        <button
          className={`button button--primary`}
          style={{ margin: "2em 0em 2em auto" }}
          onClick={askGPT}
          disabled={loading}
        >
          Generate HTML
          {loading && <div className="icon icon--spinner icon--spin"></div>}
        </button>
        <textarea
          className="textarea"
          rows={6}
          placeholder="Here you'll see the html"
          style={{ marginTop: "2em" }}
          onChange={(e) => setHtmlCode(e.target.value)}
          value={htmlCode}
        />
        <button
          disabled={!htmlCode}
          className="button button--primary"
          style={{ margin: "2em 0em 2em auto" }}
          onClick={applyHTML}
        >
          Apply HTML
        </button>
      </div>
    </>
  );
}

export default App;
