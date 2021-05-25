import { Component } from 'react';

import '@fontsource/roboto';

import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';

import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';

import Navbar from './Navbar';
import PromptDialog from './PromptDialog';
import resolveUri from './resolve-uri';

const homepage = 'gemini://gemini.circumlunar.space/';

const LINK = /^=>\s+(\S+)(?:\s+(.*))?/;

export default class App extends Component {
  state = { history:[] };

  componentDidMount() {
    this.updateLocation(homepage);
  }

  asyncPrompt = async (text, sensitive) => {
    return new Promise((resolve, reject) => {
      const onSuccess = userInput => { this.setState({ prompt:null }); resolve(userInput); };
      const onFailure = err       => { this.setState({ prompt:null }); reject(err); };

      this.setState({ prompt:{ text, sensitive, onSuccess, onFailure } });
    });
  };

  updateLocation = async (target, redirects=[]) => {
    const { currentUri } = this.state;

    const uri = resolveUri(target, currentUri);
    if(!uri.startsWith('gemini:')) {
      return window.gemini.openUrl(uri);
    }

    const history = [ ...this.state.history ];
    if(!redirects.length) {
      redirects.push(uri);
      history.push(uri);
    }

    this.setState({ loading:true, currentUri:uri, history, content:null, mime:null, error:null });
    try {
      const res = await window.gemini.get(uri);

      let content, mime='text/gemini', loading=true;
      switch(res.t) {
        case 'success':  content=res.v; mime=res.mime; loading=false; break;
        case 'redirect': {
          const redirectTarget = res.v;
          redirects.push(redirectTarget);

          if(redirects.length > 3) {
            content = `# Too many redirects\n\n${redirects.map((uri, i) => `=> ${uri} ${i}. ${uri}`).join('\n->\n')}`;
            loading = false;
          } else if(resolveUri(redirectTarget, currentUri).startsWith('gemini://')) {
            this.updateLocation(redirectTarget, redirects);
          } else {
            content = `# Redirect to non-Gemini url:\n\n=> ${redirectTarget}`;
            loading = false;
          }
        } break;
        case 'input': {
          const param = await this.asyncPrompt(res.v, res.sensitive);
          this.updateLocation(uri + '?' + encodeURIComponent(param));
        } break;
        default: throw new Error(`Unknown response type: ${JSON.stringify(res)}`);
      }
      this.setState({ content, mime, loading });
    } catch(error) {
      this.setState({ error, loading:false });
    }
  };

  goBack = (steps=0) => {
    const history = this.state.history.slice(0, -1-steps);

    const target = history.pop();

    this.setState({ history }, () => {
      this.updateLocation(target);
    });
  };

  goHome = () => {
    this.updateLocation(homepage);
  };

  refresh = () => {
    const history = [ ...this.state.history ];

    const target = history.pop();

    this.setState({ history }, () => {
      this.updateLocation(target);
    });
  };

  render() {
    const { content, currentUri, mime, error, history, loading, prompt } = this.state;

    const paperContent =
        loading ? <CentralLoader/> :
        error   ? <ErrorContent error={error}/> :
        content ? (
          mime === 'text/gemini' ? <GeminiText content={content} handleLink={this.updateLocation}/> :
              <><h1>mime: {mime}</h1><h1>Content</h1><pre>{content}</pre></>
        ) : null;


    return (
      <>
        <Navbar uri={currentUri} onChangeUri={this.updateLocation} goBack={this.goBack} goHome={this.goHome} history={history} refresh={this.refresh}/>
        <Paper elevation={3} style={{marginLeft:'auto', marginRight:'auto', marginBottom:'2em', maxWidth:1024, padding:'1em'}}>
          {paperContent}
        </Paper>
        <PromptDialog {...prompt}/>
      </>
    );
  }
};

function ErrorContent({ error }) {
  return (
    <>
      <h1>Error loading page</h1>
      <h2>{error.message}</h2>
      <pre>{error.stack}</pre>
    </>
  );
}

class GeminiText extends Component {
  render() {
    const { content, handleLink } = this.props;

    let lastIdx = -1;
    const elements = [];

    let pre;
    let list;

    content
        .split('\n')
        .forEach(line => {
          if(pre) {
            if(line.startsWith('```')) {
              elements.push(<Pre lines={pre} key={++lastIdx}/>);
              pre = null;
            } else {
              pre.push(line);
            }
            return;
          }
          if(line.startsWith('```')) {
            pre = [];
            return;
          }

          if(list) {
            if(line.startsWith('* ')) {
              list.push(line);
              return;
            } else {
              elements.push(<GeminiList items={list} key={++lastIdx}/>);
              list = null;
              /* falls through */
            }
          }
          if(line.startsWith('* ')) {
            list = [ line ];
            return;
          }

          if(line.startsWith('# '))   { elements.push(<h1 key={++lastIdx}>{line.substring(2)}</h1>); return; }
          if(line.startsWith('## '))  { elements.push(<h2 key={++lastIdx}>{line.substring(3)}</h2>); return; }
          if(line.startsWith('### ')) { elements.push(<h3 key={++lastIdx}>{line.substring(4)}</h3>); return; }
          if(line.match(LINK)) {
            const parts = line.match(LINK);
            const target = parts[1];
            const text = (parts[2] || target);
            elements.push(
              <p key={++lastIdx}>
                <Tooltip title={target}>
                  <span style={{textDecoration:'underline', color:'blue', cursor:'pointer'}} onClick={() => handleLink(target)}>{text}</span>
                </Tooltip>
              </p>
            );
            return;
          }
          elements.push(<p key={++lastIdx}>{line}</p>);
        });

    if(pre) elements.push(<Pre lines={pre} key={++lastIdx}/>);
    if(list) elements.push(<GeminiList items={list} key={++lastIdx}/>);

    return elements;
  }
}

function Pre({ lines }) {
  return <pre>{lines.join('\n')}</pre>;
}

function GeminiList({ items }) {
  return (
    <List>
      {items.map((text, idx) => (
        <ListItem key={idx}>
          <ListItemIcon><KeyboardArrowRightIcon/></ListItemIcon>
          <ListItemText>{text.substring(2)}</ListItemText>
        </ListItem>
      ))}
    </List>
  );
}

function CentralLoader() {
  return (
    <Grid container style={{padding:20}} justify="center">
      <CircularProgress/>
    </Grid>
  );
}
