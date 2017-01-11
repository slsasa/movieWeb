module.exports = function(grunt) {

    grunt.initConfig({

        watch: {
            jade: {
                files: ['views/**/*.jade'],
                options: {
                    livereload: true
                }
            },
            js: {
                files: ['public/js/**','models/**/*.js','schemas/**/*.js'],
                //tasks: ['jshint'],
                options: {
                    livereload: true  //当文件改动，重新启动服务
                }
            }
        },

        nodemon: {
            dev: {
                options: {
                    file: 'app.js',
                    args: [],
                    ignoredFiles:['README.md','node_modules/**','.DS_Store'],
                    watchedExtensions: ['js'],
                    watchedFolders: ['./'],
                    debug: true,
                    delayTime: 1,
                    env: {
                        PORT: 3000
                    },
                    cwd: __dirname
                }
            }
        },

        concurrent: {
            target: {
                tasks: ['nodemon', 'watch'],
                options: {
                    logConcurrentOutput: true
                }
            }
        }
    })

    grunt.loadNpmTasks('grunt-contrib-watch') //加载插件 当文件更新，它会重新执行，在grunt内布置好的任务
    grunt.loadNpmTasks('grunt-nodemon') //实时监听app.js app.js一更新，它会自动重启app.js
    grunt.loadNpmTasks('grunt-concurrent') //优化构建时间

    grunt.option('force',true) //预防语法错误，不会中断服务
    grunt.registerInitTask('default',['concurrent'])
}
