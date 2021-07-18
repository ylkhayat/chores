import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "./components/index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createTheme, ThemeProvider } from "@material-ui/core";
import lightBlue from "@material-ui/core/colors/lightBlue";
import pick from "lodash/pick";

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const apolloClient = new ApolloClient({
  uri: "https://api-eu-central-1.graphcms.com/v2/ckr6nzcgj0qkk01xjfghf44wb/master",
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          chores: {
            keyArgs: false,
            merge(existing, incoming, { args: { offset = 0 } }) {
              const merged = existing ? existing.slice(0) : [];
              for (let i = 0; i < incoming.length; ++i) {
                merged[offset + i] = incoming[i];
              }
              return merged;
            },
          },
        },
      },
    },
  }),
});

const theme = createTheme({
  typography: {
    fontFamily: ['"Poppins"', "Arial", "sans-serif"].join(","),
  },
  palette: {
    primary: lightBlue,
  },
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <ApolloProvider client={apolloClient}>
        <App />
      </ApolloProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
