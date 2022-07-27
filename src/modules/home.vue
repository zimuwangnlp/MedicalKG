<template>
    <div class="moduleItemArea">
        <div class="topInfoArea">
            <span class='titleItem'>图谱分析
                <el-button link type="primary" @click="handleButtonClick">
                    <el-icon>
                    </el-icon>刷新图
                  </el-button></span>
            <span class="buttonItem">

            </span>
        </div>
        <el-row :gutter="20">
            <el-col :span="4">
                <div class="grid-content bg-purple">
                    <div style="margin-top: 15px;">
                        <el-input placeholder="请输入图谱名称" v-model="graph_name"></el-input>
                    </div>
                </div>
            </el-col>
            <el-col :span="4">
                <div class="grid-content bg-purple">
                    <div style="margin-top: 15px;">
                        <el-input placeholder="请输入节点名称" v-model="node_name"></el-input>
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="20">
                <div class="grid-content bg-purple">
                    <div ref="graghChartArea" style="margin-top: 15px; height: 650px;">
                        图
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import * as echarts from "echarts";

    export default {
        name: '',
        components: {},
        data() {
            return {
                node_name: "",
                graph_name: "",
                graphOption: {
                    title: {
                        text: 'Medical Knowledge Graph',
                        subtext: 'Default layout',
                        top: 'bottom',
                        left: 'right'
                    },
                    tooltip: {},
                    series: [
                        {
                            name: 'Medical Knowledge Graph',
                            type: 'graph',
                            layout: 'force',
                            data: [],
                            links: [],
                            categories: [],
                            roam: true,
                            label: {
                                show: true,
                                position: 'right'
                            },
                            force: {
                                repulsion: 1000
                            }
                        }
                    ]
                }
            };
        },
        watch: {
            $route(to, from) {

            },
        },
        computed: {},
        mounted() {
            let elem = this.$refs.graghChartArea;
            this.updateGraph(elem,{},30);
        },
        methods: {
            handleButtonClick(){
                this.updateGraph(elem,{},30);
            },
            updateGraph(elem, query,  size) {
                var _self = this;
                adapter.getGraphData(query ||{ }, function (tData) {
                    var graph = tData.data;
                    graph.nodes.forEach(function (node) {
                        node.symbolSize = size || 5;
                    });
                    _self.graphOption.series[0].data = graph.nodes;
                    _self.graphOption.series[0].links = graph.links;
                    _self.graphOption.series[0].categories = graph.categories;
                    if (!_self.graphChart) {
                        _self.graphChart = echarts.init(elem);
                    }
                    else {
                        _self.graphChart.dispose();
                    }
                    _self.graphChart.setOption(_self.graphOption);

                });
            }
        },
    };
</script>

<style>
    .moduleItemArea {
        float: left;
        width: 100%;
        height: 100%;
        filter: "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='scale')";
        -moz-background-size: 100% 100%;
        background-size: 100vw 100%;
        display: block;
        position: relative;
        padding-right: 10px;
    }

    .topInfoArea {
        width: 100%;
        height: auto;
        margin-top: 15px;
        float: left;
    }

    .titleItem {
        float: left;
        padding-left: 10px;
        border-left: solid 4px rgb(0, 19, 74);
    }

    .buttonItem {
        float: right;
        margin-right: 10px;
    }

    .grid-content p {
        margin-top: 0px;
    }

    .el-select .el-input {
        width: 130px;
    }

    .input-with-select .el-input-group__prepend {
        background-color: #fff;
    }

</style>
