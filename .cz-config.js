module.exports = {
    types: [
        {value: 'feat',     name: '✨ feat:      新功能'},
        {value: 'fix',      name: '🐛 fix:       修复'},
        {value: 'chore',    name: '🚀 chore:     构建过程或辅助工具的变动'},
        {value: 'perf',     name: '⚡️ perf:      性能优化'},
        {value: 'style',    name: '💄 style:     代码格式(不影响代码运行的变动)'},
        {value: 'refactor', name: '♻️  refactor:  重构(既不是增加feature，也不是修复bug)'},
        {value: 'revert',   name: '⏪️ revert:    回退'},
        {value: 'docs',     name: '✏️  docs:      文档变更'},
        {value: 'ci',       name: '👷 ci:        脚手架优化(不影响代码运行的变动)'},
        {value: 'test',     name: '✅ test:      增加测试'},
        {value: 'build',    name: '📦️ build:     打包'},
        {value: 'init',     name: '🎉 init:      初始化'},     
    ],
    // override the messages, defaults are as follows
    messages: {
        type: '请选择提交类型:',
        scope: '请输入文件修改范围(可选):',
        // used if allowCustomScopes is true
        customScope: '请输入修改范围(可选):',
        subject: '请简要描述提交(必填):',
        body: '请输入详细描述(可选，待优化去除，跳过即可):',
        breaking: '列出任何BREAKING CHANGES(可选)',
        footer: '请输入要关闭的issue(可选):',
        confirmCommit: '确认使用以上信息提交？(y/n/e/h)'
    },
    allowCustomScopes: true,
    allowBreakingChanges: ['feat', 'fix'],
    skipQuestions: ['body', 'breaking'],
    // limit subject length, commitlint默认是72
    subjectLimit: 72
}