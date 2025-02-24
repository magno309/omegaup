<template>
  <div class="root d-flex flex-column h-100">
    <div class="summary">
      {{ summary }}
    </div>
    <div class="filenames">
      <div class="list-group">
        <button
          v-if="!groups"
          class="list-group-item list-group-item-action disabled"
          type="button"
        >
          <em>Empty</em>
        </button>
        <template v-for="group in groups" v-else :title="name">
          <div
            v-if="group.explicit"
            :key="group.name"
            class="list-group-item list-group-item-secondary"
          >
            <div>
              <span
                class="verdict"
                :class="verdictClass(groupResult(group.name))"
                :title="verdictTooltip(groupResult(group.name))"
                >{{ verdictLabel(groupResult(group.name))
                }}<span class="score">{{
                  score(groupResult(group.name))
                }}</span></span
              >
              <span :title="group.name">{{ group.name }}</span>
            </div>
          </div>
          <button
            v-for="item in group.cases"
            :key="item.name"
            class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
            type="button"
            :class="{
              'in-group': group.explicit,
              active: currentCase == item.name,
            }"
            @click="selectCase(item.name)"
          >
            <div class="case-item">
              <span
                class="verdict"
                :class="verdictClass(item.name)"
                :title="verdictTooltip(caseResult(item.name))"
                >{{ verdictLabel(caseResult(item.name))
                }}<span class="score">{{
                  score(caseResult(item.name))
                }}</span></span
              >
              <span :title="item.name">{{ item.name }}</span>
            </div>
            <button
              v-if="groups.length > 1"
              aria-label="Close"
              class="close"
              type="button"
              @click.prevent.stop="removeCase(item.name)"
            >
              <span aria-hidden="true">×</span>
            </button>
          </button>
        </template>
      </div>
    </div>
    <form @submit.prevent="createCase()">
      <div class="input-group">
        <input
          v-model="newCaseWeight"
          class="form-control case-weight"
          type="text"
        />
        <input v-model="newCaseName" class="form-control" type="text" />
        <div class="input-group-append">
          <button
            class="btn btn-secondary"
            type="submit"
            :disabled="newCaseName.length == 1"
            @click="createCase()"
          >
            +
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import * as Util from './util';

export default {
  props: {
    store: {
      type: Object,
      required: true,
    },
    storeMapping: {
      type: Object,
      required: true,
    },
  },
  data: function () {
    return {
      newCaseWeight: 1,
      newCaseName: '',
    };
  },
  computed: {
    summary: function () {
      if (
        this.store.state.dirty ||
        !this.store.state.results ||
        !this.store.state.results.verdict
      ) {
        return '…';
      }
      return (
        this.store.state.results.verdict +
        ' ' +
        this.score(this.store.state.results)
      );
    },
    groups: function () {
      const flatCases = Util.vuexGet(this.store, this.storeMapping.cases);
      let resultMap = {};
      for (let caseName in flatCases) {
        if (!Object.prototype.hasOwnProperty.call(flatCases, caseName))
          continue;
        let tokens = caseName.split('.', 2);
        if (!Object.prototype.hasOwnProperty.call(resultMap, tokens[0])) {
          resultMap[tokens[0]] = {
            explicit: tokens.length > 1,
            name: tokens[0],
            cases: [],
          };
        }
        resultMap[tokens[0]].cases.push({
          name: caseName,
          item: flatCases[caseName],
        });
      }
      let result = [];
      for (let groupName in resultMap) {
        if (!Object.prototype.hasOwnProperty.call(resultMap, groupName))
          continue;
        resultMap[groupName].cases.sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });
        result.push(resultMap[groupName]);
      }
      result.sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });
      return result;
    },
    currentCase: {
      get() {
        return Util.vuexGet(this.store, this.storeMapping.currentCase);
      },
      set(value) {
        Util.vuexSet(this.store, this.storeMapping.currentCase, value);
      },
    },
  },
  methods: {
    caseResult: function (caseName) {
      let flatCaseResults = this.store.getters.flatCaseResults;
      if (
        this.store.state.dirty ||
        !Object.prototype.hasOwnProperty.call(flatCaseResults, caseName)
      )
        return null;
      return flatCaseResults[caseName];
    },
    groupResult: function (groupName) {
      let results = this.store.state.results;
      if (this.store.state.dirty || !results || !results.groups) return null;
      for (let group of results.groups) {
        if (group.group == groupName) return group;
      }
      return null;
    },
    verdictLabel: function (result) {
      if (!result) return '…';
      if (typeof result.verdict === 'undefined') {
        if (result.contest_score == result.max_score) return '✓';
        return '✗';
      }
      switch (result.verdict) {
        case 'CE':
          return '…';
        case 'AC':
          return '✓';
        case 'PA':
          return '½';
        case 'WA':
          return '✗';
        case 'TLE':
          return '⌚';
      }
      return '  ☹';
    },
    verdictClass: function (result) {
      if (!result) return '';
      return result.verdict;
    },
    verdictTooltip: function (result) {
      if (!result) return '';
      let tooltip = '';
      if (typeof result.verdict !== 'undefined') {
        tooltip = result.verdict + ' ';
      }
      return tooltip + this.score(result);
    },
    score: function (result) {
      if (!result) return '…';
      return (
        this.formatNumber(result.contest_score) +
        '/' +
        this.formatNumber(result.max_score)
      );
    },
    formatNumber: function (value) {
      let str = value.toFixed(2);
      if (str.endsWith('.00')) return str.substring(0, str.length - 3);
      return str;
    },
    selectCase: function (name) {
      this.currentCase = name;
    },
    createCase: function () {
      if (!this.newCaseName) return;
      this.store.commit('createCase', {
        name: this.newCaseName,
        weight: parseFloat(this.newCaseWeight),
      });
      this.currentCase = this.newCaseName;
      this.newCaseWeight = 1;
      this.newCaseName = '';
    },
    removeCase: function (name) {
      this.store.commit('removeCase', name);
    },
  },
};
</script>

<style scoped>
button.in-group {
  border-left-width: 6px;
  padding-left: 15px;
}

button[type='submit'] {
  width: 2em;
}

div.summary {
  text-align: center;
  padding: 0.25em;
}

div.case-item {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

span.verdict {
  display: inline-block;
  float: left;
  width: 2em;
  text-align: center;
  margin: -7px 5px -6px -10px;
}

span.verdict span.score {
  font-size: xx-small;
  display: block;
}

div.filenames {
  overflow-y: auto;
  flex: 1;
}

a.list-group-item {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

input.case-weight {
  flex: 0.3;
}
</style>
