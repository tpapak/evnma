var deepSeek = require('safe-access');
var clone = require('../../lib/mixins.js').clone;
var uniqId = require('../../lib/mixins.js').uniqId;
var sortStudies = require('../../lib/mixins.js').sortStudies;
var Messages = require('../../messages.js').Messages;
var Report = require('../../purescripts/output/Report');
Report.view = require('../../purescripts/output/Report.View');
Report.update = require('../../purescripts/output/Report.Update');


var children = [
  Report
  ];

var Update = (model) => {
  //update functions will only change state in that node of the model DAG
  let modelPosition = 'project.indirectness.netindr';
  let updaters = {
    getState: () => {
      return deepSeek(model,'getState().project.indirectness.netindr');
    },
    cmReady: () => {
      let isready = false;
      if (deepSeek(model,'getState().project.CM.currentCM.status')==='ready'){
        isready = true;
        // console.log('contribution matrix ready');
      }
      return isready;
    },
    dindrReady: () => {
      let isready = false;
      if (typeof deepSeek(model,'getState().project.CM.currentCM.studycontributions')!=='undefined'){
        isready = true;
      }
      return isready;
    },
    updateState: (model) => {
      let mdl = model.getState();
      if (updaters.dindrReady()){
        if (deepSeek(updaters,'getState().status') === 'ready'){
        }else{
          updaters.setState(updaters.completeModel());
        }
      }else{
        updaters.setState(updaters.skeletonModel());
      }
      _.map(children, c => {
        c.update.updateState(mdl)(mdl);
      });
    },
    setState: (newState) => {
      if(typeof deepSeek(model,"getState().project.indirectness") !== 'undefined'){
        model.getState().project.indirectness.netindr = newState;
	updaters.saveState();
      }else{
      }
    },
    getRule: () => {
      return updaters.getState().rule;
    },
    selectIndividual: (value) => {
      let [tid,tv] = value.value.split('σδel');
      let boxes = updaters.getState().boxes;
      let tbc = _.find(boxes, m => {
        return m.id === tid;
      });
      let rulevalue = tbc.ruleLevel;
      tbc.customized = tbc.judgement === tbc.ruleLevel;
      // console.log('tid tv',tid,tv,'rule',rulevalue);
      if(parseInt(tv) !== rulevalue){
        if((tbc.judgement === 'nothing')||(tbc.judgement === rulevalue)){
          updaters.getState().customized += 1;
        }      
      }else{
        updaters.getState().customized -= 1;
      }
      tbc.judgement = parseInt(tv);
      updaters.getState().status = 'selecting';
      updaters.saveState();
      updaters.getState().status = 'ready';
      Messages.alertify().success(model.getState().text.NetIndr.LimitationsSet);
      updaters.saveState();
    },
    saveState: () => {
      model.saveState();
      let mdl = model.getState();
      // console.log('saving study limitations and Report');
      _.map(children, c => {
        // console.log("report module", mdl);
        c.update.updateState(mdl)(mdl);
      });
    },
    createEstimates: () => {
      let cm = model.getState().project.CM.currentCM;
      let directIndrs = _.object(_.map(model.getState().project.indirectness.directs.directBoxes,
        dc => {
          let colname = _.find(cm.colNames,cname => {
            let cid = uniqId([dc.t1.toString(),dc.t2.toString()]);
            let cnid = uniqId(cname.split(':'));
            return _.isEqual(cid,cnid);
          });
          return [colname,dc.judgement];
      }));
      let groupContributions = (contributions) => {
        let res =  _.groupBy(_.toArray(contributions),'indr');
        res = _.map(res, r => {
          return {
            indr: parseInt(r[0].indr),
            percentage: _.reduce(_.pluck(r,'amount'), function(memo, num){ return memo + num; }, 0),
          };
        });
        return res;
      };
      let majRule = (contributions) => {
        let res = groupContributions(contributions);
        res = _.reduce(res, (memo, r) => {
          let per = r.percentage;
          if(per > memo[1]){
            return [r.indr,r.percentage];
          }else{
            return memo;
          }
        },[0,0]);
        return {indr:res[0],percentage:res[1]};
      };
      let meanRule = (contributions) => {
        let res = groupContributions(contributions);
        res = _.reduce(res, (memo,r) => {
          return memo + (r.indr * r.percentage / 100);
        },0);
        // console.log(res,Math.round(res),'res');
        return Math.round(res);
      };
      let maxRule = (contributions) => {
        let res = groupContributions(contributions);
        res = _.reduce(res, (memo, r) => {
          if (r.indr > memo){
            return r.indr;
          }else{
            memo;
          }
        },0);
        return res;
      };
      let makeRules = (rownames,colnames,studies) => {
        let project =  deepSeek(model,'getState().project');
        let levels = deepSeek(model,'getState().defaults.netIndrLevels');
        return _.map(sortStudies(rownames,studies), d => {
        let stcs = deepSeek(project,"CM.currentCM.studycontributions");
        let key = _.find(_.keys(stcs), k => {
              let aresame = (
                ( (k.split(':')[0]===d[0].split(':')[0]) &&
                (k.split(':')[1]===d[0].split(':')[1])) || 
                ( (k.split(':')[1]===d[0].split(':')[0]) &&
                (k.split(':')[0]===d[0].split(':')[1]))
              );
              return aresame});
          let contributions = stcs[key];
          contributions = _.mapObject(contributions, (amount,id) => {
            return {
              indr: project.studies.indrs[id],
              amount
            }
          });
          return {
            id: d[0],
            judgement: -1,
            customized: false,
            ruleLevel: -1,
            color: '',
            contributions,
            levels : deepSeek(model,'getState().defaults.netIndrLevels'),
            rules: [{ 
                id: 'majRule',
                name: model.getState().text.NetIndr.rules.majRule, 
                label: levels[majRule(contributions).indr-1].label,
                value: majRule(contributions).indr,
                isActive : false
              },
              { id: 'meanRule',
                name: model.getState().text.NetIndr.rules.meanRule, 
                label: levels[meanRule(contributions)-1].label,
                value: meanRule(contributions),
                isActive : false
              },
              { id: 'maxRule',
                name: model.getState().text.NetIndr.rules.maxRule, 
                label: levels[maxRule(contributions)-1].label,
                value: maxRule(contributions),
                isActive : false
            }],
          }
        })
      };
      let mixed = makeRules(cm.directRowNames,cm.colNames,cm.directStudies);
      _.map(mixed, m => { m.isMixed = true } );
      let indirect = makeRules(cm.indirectRowNames,cm.colNames,cm.indirectStudies);
      _.map(indirect, i => { i.isMixed = false } );
      return _.union(mixed,indirect);
    },
    completeModel: () => {
      let boxes = updaters.createEstimates();
      let levels = deepSeek(model,'getState().defaults.netIndrLevels');
      return { 
        status: 'noRule',// noRule, editing, ready
        rule: 'noRule', // noRule, majRule, meanRule, maxRule
        customized: 0,
        levels, 
        boxes,
      }
    },
    skeletonModel: () => {
      let levels = deepSeek(model,'getState().defaults.netIndrLevels');
      return { 
        status: 'not-ready',// noRule, editing, ready
        rule: 'noRule', // noRule, majRule, meanRule, maxRule
        levels, 
        customized: 0,
        boxes: [],
      }
    },
    selectRule: (rule) => {
      let nrstate = updaters.getState();
      nrstate.rule = rule.value;
      nrstate.status = 'ready';
      let boxes = updaters.getState().boxes; 
      _.map(boxes, m => {
        m.judgement = _.find(m.rules,mr =>{return mr.id===rule.value}).value;
        m.ruleLevel = m.judgement; 
        m.customized = false;
      });
      updaters.saveState();
      Messages.alertify().success(model.getState().text.NetIndr.LimitationsSet);
    },
    resetNetIndr: () => {
      updaters.setState(updaters.completeModel());
    },
  }
  return updaters;
};


module.exports = () => {
  return Update;
}
