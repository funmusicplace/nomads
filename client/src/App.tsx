import { css, injectGlobal } from "@emotion/css";
import React from "react";
import { Outlet } from "react-router-dom";
import api from "services/api";
import { useGlobalStateContext } from "state/GlobalState";
import Header from "./components/Header";

injectGlobal`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  @font-face {
    font-family: 'Patrick Hand SC';
    font-style: normal;
    font-weight: 400;
    src: local('Patrick Hand SC'),
      local('PatrickHandSC-Regular'),
      url(https://fonts.gstatic.com/s/patrickhandsc/v4/OYFWCgfCR-7uHIovjUZXsZ71Uis0Qeb9Gqo8IZV7ckE.woff2)
        format('woff2');
    unicode-range: U+0100-024f, U+1-1eff,
      U+20a0-20ab, U+20ad-20cf, U+2c60-2c7f,
      U+A720-A7FF;
  }

  @media (prefers-color-scheme: dark) {
    body {
      background: #333;
      color: white;
    }
  }

  html {
    font-size: 18px;
  }

  h1 {
    font-size: 3rem;
  }

  h2 {
    font-size: 2.5rem;
  }

  h3 {
    font-size: 1.8rem;
    padding-bottom: 1rem;
  }

  h4 { 
    font-size: 1.4rem;
    padding-bottom: .75rem;
  }

  h5 {
    font-size: 1.2rem;
    padding-bottom: .75rem;
  }

  @keyframes slide-down {
    from {
      opacity: 0;
      transform: translateY(-3rem);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slide-up {
    from {
      opacity: 0;
      transform: translateY(3rem);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes spinning {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

function App() {
  const { state } = useGlobalStateContext();
  React.useEffect(() => {
    let interval: NodeJS.Timer | null = null;
    if (state.user) {
      interval = setInterval(async () => {
        await api.post("refresh", {});
      }, 1000 * 60 * 5); // refresh every 5 minutes
    } else {
      api.post("refresh", {});
    }
    return () => (interval ? clearInterval(interval) : undefined);
  }, [state.user]);

  return (
    <div
      className={css`
        display: flex;
        flex-direction: column;
      `}
    >
      <Header />
      <Outlet />
    </div>
  );
}

export default App;
