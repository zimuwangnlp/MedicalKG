export default {
    state: {
        loadingCount: 0
    },
    mutations: {
        showLoading(state) {
            state.loadingCount += 1;
        },
        hideLoading(state) {
            state.loadingCount = Math.max(0, state.loadingCount - 1);
        },
    },
    getters: {

    },
    actions: {},
    modules: {

    },
};