// server
import fs from 'fs';
import url from 'url';
import path from 'path';
import http from 'http';
import https from 'https';

// vue
import Vue from '../../vue/vue.common.js';
import createRenderer from '../../vue/server-renderer.js';
import { compileToFunctions } from '../../vue/compiler.js';

// server-side rendering
const { renderToString } = createRenderer();

const compileTemplateWithOptions = (options) => {
  const res = compileToFunctions(options.template);
  Object.assign(options, res);
  return options;
};

const renderVmWithOptions = (options, cb) => {
  options = compileTemplateWithOptions(options);
  renderToString(new Vue(options), cb);
};

// app and components
import AppOptions from '../common/app';
import CommitsOptions from '../common/commits';
import CommitOptions from '../common/commit';

const commits = Vue.component('commits', compileTemplateWithOptions(CommitsOptions));
const commit = Vue.component('commit', compileTemplateWithOptions(CommitOptions));

// data
const apiUrl = 'https://api.github.com/repos/vuejs/vue/commits?per_page=3&sha=';
const branches = ['master', 'dev', 'next'];

const loadCommits = (branch, cb) => {
  const branchUrl = url.parse(`${apiUrl}${branch}`);
  const options = {
    headers: {'user-agent': 'Vue.js SSR example'},
    host: branchUrl.host,
    path: `${branchUrl.path}${branchUrl.search}`
  }
  https.get(options, (res) => {
    let body = '';
    res.on('data', d => body += d);
    res.on('end', () => cb(JSON.parse(body)));
  });
};

// server and request handling
const vueJsPath = path.resolve(__dirname, '..', '..', 'vue', 'vue.js');
const appJsPath = path.resolve(__dirname, '..', '..', 'dist', 'app.js');
const layoutPath = path.resolve(__dirname, 'layout.html');

const handleRequest = (req, res) => {
  switch (req.url) {
    // external file requests
    case '/vue.js':
      res.end(fs.readFileSync(vueJsPath).toString());
      break;

    case '/app.js':
      res.end(fs.readFileSync(appJsPath).toString());
      break;

    // retrieve the data and render the layout with embedded app
    default:
      // lookup branch from request path (/dev or /next), fallback to master
      const requestedBranch = req.url.substring(1);
      const branch = branches.indexOf(requestedBranch) != -1 ?
        requestedBranch :
        branches[0];

      loadCommits(branch, (response) => {
        // handle api errors
        const errorMessage = response.message || false;
        const commits = errorMessage ? [] : response;
        const data = {
          apiUrl: apiUrl,
          branches: branches,
          currentBranch: branch,
          commits: commits,
          errorMessage: errorMessage
        };
        Object.assign(AppOptions, { data: data });
        renderVmWithOptions(AppOptions, (err, result) => {
          if (err) { console.error(err); }
          let rendered = fs.readFileSync(layoutPath).toString();
          rendered = rendered.replace('{{ app }}', result);
          rendered = rendered.replace('{{ initialState }}', JSON.stringify(data));
          res.end(rendered);
        });
      });
  }
};

const port = process.env.PORT;
http.createServer(handleRequest).listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
