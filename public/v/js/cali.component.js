$(document).ready(function(){
    //header
    // 定义名为 headerdiv 的新组件
    Vue.component('headerdiv', {
        // headerdiv 组件现在接受一个
        // 这个属性名为 book。
        props: ['book'],
        template: '\
        <div class="row">\
            <nav class="navbar navbar-default navbar-inverse navbar-fixed-top nav-background-color">\
                <div class="container-fluid">\
                <!-- Brand and toggle get grouped for better mobile display -->\
                    <div class="navbar-header">\
                    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">\
                        <span class="sr-only">Toggle navigation</span>\
                        <span class="icon-bar"></span>\
                        <span class="icon-bar"></span>\
                        <span class="icon-bar"></span>\
                    </button>\
                    <a class="navbar-brand" href="/" target="_blank">Cali</a>\
                    </div>\
                    <!-- Collect the nav links, forms, and other content for toggling -->\
                    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">\
                        <ul class="nav navbar-nav">\
                            <li v-bind:class="{ active: isindex }"><a href="/"><span v-text="$t(\'lang.index\')"></span> <span class="sr-only">(current)</span></a></li>\
                            <li v-bind:class="{ active: islibrary }"><a href="/public"><span v-text="$t(\'lang.library\')"></span> <span class="sr-only">(current)</span></a></li>\
                            <li><a href="https://github.com/jiangmitiao/cali/blob/master/README.md"><span v-text="$t(\'lang.help\')"></span></a></li>\
                            <li><a href="http://blog.gavinzh.com"><span v-text="$t(\'lang.blog\')"></span></a></li>\
                            <li v-if="leftdropdownseen" class="dropdown">\
                                <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Dropdown <span class="caret"></span></a>\
                                    <ul class="dropdown-menu">\
                                        <li><a href="#">Action</a></li>\
                                        <li><a href="#">Another action</a></li>\
                                        <li><a href="#">Something else here</a></li>\
                                        <li role="separator" class="divider"></li>\
                                        <li><a href="#">Separated link</a></li>\
                                        <li role="separator" class="divider"></li>\
                                        <li><a href="#">One more separated link</a></li>\
                                    </ul>\
                            </li>\
                        </ul>\
                        <form class="navbar-form navbar-left" method="get" action="/search" target="_blank">\
                            <div class="form-group">\
                                <input name="q" type="text" class="form-control" :placeholder="$t(\'lang.searchholder\')">\
                            </div>\
                            <button type="submit" class="btn btn-default"><span v-text="$t(\'lang.search\')"></span></button>\
                        </form>\
                        <ul class="nav navbar-nav navbar-right">\
                            <li><a href="https://github.com/jiangmitiao/cali"  target="_blank">Github</a></li>\
                            <li v-if="rightdropdownseen" class="dropdown">\
                                <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><span v-if="islogin" v-text="user.userName"></span><span v-if="!islogin" v-text="$t(\'lang.login\') + $t(\'lang.signup\')"></span><span class="caret"></span></a>\
                                <ul class="dropdown-menu">\
                                    <li v-if="islogin"><a href="/person"><span v-text="$t(\'lang.personcenter\')"></span></a></li>\
                                    <li role="separator" class="divider"></li>\
                                    <li v-if="!islogin"><a href="/login"><span v-text="$t(\'lang.login\')"></span></a></li>\
                                    <li v-if="!islogin"><a href="/signup"><span v-text="$t(\'lang.signup\')"></span></a></li>\
                                    <li v-if="islogin"><a @click="logout"><span v-text="$t(\'lang.logout\')"></span></a></li>\
                                </ul>\
                            </li>\
                        </ul>\
                    </div>\
                </div>\
            </nav>\
    </div>\
        ',
        methods:{
            logout:function () {
                fetch('/api/user/logout',{method:'post',body:commonData()}).then(function(response) {
                    store.remove('user');
                    store.remove('session');
                    if (response.redirected){
                        window.location.href = response.url;
                    }else {
                        window.location.reload(true);
                    }
                }).catch(function(ex) {
                    tips("error",ex);
                });
                return false;
            }
        },
        data:function () {
            return {
                rightdropdownseen: function () {
                    return true;
                }(),
                leftdropdownseen: function () {
                    return false
                }(),
                isindex:function () {
                    return window.location.pathname === "/";
                }(),
                islibrary:function () {
                    return window.location.pathname.indexOf("public") >= 0;
                }(),
                islogin:function () {
                    if (_.isUndefined(store.get("session")) || _.isUndefined(store.get("user"))){
                        return false;
                    }else {
                        fetch('/api/user/islogin',{method:'post',body:commonData()}).then(function(response) {
                            return response.json()
                        }).then(function(json) {
                            if (json.statusCode !== 200){
                                store.remove('user');
                                store.remove('session');
                                window.location.reload(true);
                            }
                        }).catch(function(ex) {
                            tips("error",ex);
                        });
                        return true;
                    }
                }(),
                user:function () {
                    return _.isUndefined(store.get("user"))?{}:store.get("user");
                }()
            };
        }
    });

    // 定义名为 footerdiv 的新组件
    Vue.component('footerdiv', {
        // headerdiv 组件现在接受一个
        // 这个属性名为。
        props: [],
        template: '\
        <footer class="navbar-fixed-bottom">\
            <div class="container">\
                <div class="copy text-center">\
                    Copyright 2017 <a href="/">Cali</a>\
                </div>\
            </div>\
        </footer>\
        '
    });


    //public
    // 定义名为 bookdiv 的新组件
    Vue.component('bookdiv', {
        // bookdiv 组件现在接受一个
        // 这个属性名为 book。
        props: ['book'],
        template: '\
        <div class="col-lg-2 col-md-3 col-sm-3 col-xs-6">\
            <div class="content-box">\
                <div class="panel-body text-center">\
                    <a :href="\'/book?bookid=\'+book.id" target="_blank" class="text-center">\
                        <canvas :id="book.id" :src="fakePic(toJson(book.douban_json).image,book.id)"></canvas>\
                    </a>\
                    <p class="text-center">\
                        <a :href="\'/book?bookid=\'+book.id" target="_blank">\
                            <nobr v-text="maxstring(book.title,5)" :title="book.title" style="word-break: keep-all;white-space: nowrap;"></nobr>\
                        </a>\
                    </p>\
                    <p class="text-center">\
                        <a :href="\'/search?q=\'+book.author" target="_blank">\
                        <nobr v-text="maxstring(book.author,5)"></nobr>\
                        </a>\
                    </p>\
                    <p class="text-center badge" style="background-color: #2c3742"><span v-text="$t(\'lang.rating\')"></span>:<span  v-text="toJson(book.douban_json).rating.average"></span></p>\
                    <br>\
                </div>\
            </div>\
        </div>\
        ',
        methods:{
            //return a sub string ,sub's length is max .if src string not equals result the result add '...'
            maxstring : function (str,max) {
                let result = str.substr(0, max);
                if (result.length !== str.length){
                    result+="...";
                }
                return result;
            },
            toJson : function (str) {
                try {
                    return JSON.parse(str)
                }catch (e){
                    let json = {};
                    json.image = "https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png";
                    json.rating = {};
                    json.rating.average = 0.0;
                    return json;
                }
            },
            fakePic:function (src,id) {
                let img = new Image();
                img.src = src;
                img.onload = function(){
                    myCanvas = document.getElementById(id);
                    myCanvas.width = 100;
                    myCanvas.height = 150;
                    let context = myCanvas.getContext('2d');
                    context.drawImage(img, 0, 0);
                    //var imgdata = context.getImageData(0, 0, img.width, img.height);
                    // 处理imgdata
                };
                return "src"
            }
        }
    });

    // 定义名为 categorydiv 的新组件
    Vue.component('categorydiv', {
        // categorydiv 组件现在接受一个
        // 这个属性名为 category。
        props: ['category','categoryid'],
        template: '\
        <button type="button" @click="categoryclick(category)" :class="\'list-group-item \'+active(category,categoryid)"><i class="glyphicon glyphicon-star"></i><span v-text="category.category"></span></button>\
        ',
        methods:{
            //return a sub string ,sub's length is max .if src string not equals result the result add '...'
            categoryclick : function (c) {
                this.$emit('categoryclick',c);
            },
            active:function (category,categoryid) {
                return category.id === categoryid?"active":"";
            }
        }
    });



    //book
    // 定义名为 bookinfodiv 的新组件
    Vue.component('bookinfodiv', {
        // bookinfodiv 组件现在接受一个
        // 这个属性名为 book。
        props: ['book'],
        template: '\
        <div class="content-box-large">\
            <div class="panel-heading">\
                    <div class="panel-title"><span v-text="book.title"></span></div>\
            </div>\
            <div class="panel-body">\
                <div class="row">\
                    <div class="col-md-3 col-md-offset-1">\
                        <img width="100%" height="100%" :src="toJson(book.douban_json).image"/>\
                    </div>\
                    <div class="col-md-5">\
                        <p <span v-text="$t(\'lang.bookname\')"></span>: <span v-text="book.title"></span></p>\
                        <p><span v-text="$t(\'lang.bookauthor\')"></span>: <span v-text="book.author"></span></p>\
                        <p><span v-text="$t(\'lang.bookpublishtime\')"></span>: <span v-text="formatdate(toJson(book.douban_json).pubdate)"></span></p>\
                        <p><span v-text="$t(\'lang.bookisbn\')"></span>: <span v-text="toJson(book.douban_json).isbn13"></span></p>\
                        <p><span v-text="$t(\'lang.bookrating\')"></span>: <span v-text="toJson(book.douban_json).rating.average"></span></p>\
                        <p><span v-text="$t(\'lang.booksummary\')"></span>: <span v-html="markdown2html(toJson(book.douban_json).summary)"></span></p>\
                    </div>\
                </div>\
                <div class="row">\
                    <div class="col-md-10 col-md-offset-1">\
                        <h4 v-text="$t(\'lang.bookdownloadlink\')"></h4>\
                    </div>\
                </div>\
                <div class="row">\
                    <div class="col-md-10 col-md-offset-1" v-for="item in book.formats">\
                        <a @click="download(item)" class="btn"><h4 v-text="item.title+\'.\'+item.format"></h4></a>\
                        <a v-if="item.format==\'EPUB\'" :href="\'/read?formatid=\'+item.id" target="_blank"><span v-text="$t(\'lang.read\')"></span></a></p>\
                    </div>\
                </div>\
            </div>\
        </div>\
        ',
        methods:{
            //format the data which from back to 'YYYY-MM-DD'
            formatdate:function (d) {
                return moment(new Date(d)).format("YYYY-MM-DD")
            },
            markdown2html: function (m) {
                return markdown2html(m);
            },
            toJson : function (str) {
                try {
                    return JSON.parse(str)
                }catch (e){
                    let json = {};
                    json.image = "https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png";
                    json.rating = {};
                    json.rating.average = 0.0;
                    json.pubdate = "0";
                    json.isbn13 = "0";
                    json.format = "";
                    return json;
                }
            },
            download:function (item) {
                if (_.isUndefined(store.get("session"))){
                    tips("info","after 3 seconds, turn to login");
                    setTimeout("window.location.href = '/login'",3000);
                }else {
                    window.location.href = "/api/book/bookdown?formatid="+item.id+"&session="+store.get("session");
                }
            }
        }
    });





    //person
    // 定义名为 userdiv 的新组件
    Vue.component('usersdiv', {
        // bookinfodiv 组件现在接受一个
        // 这个属性名为 book。
        props: ['userlist'],
        template: '\
        <table class="table">\
            <thead>\
                <tr>\
                    <th>#</th>\
                    <th>#</th>\
                    <th>#</th>\
                    <th>#</th>\
                </tr>\
            </thead>\
            <tbody>\
                <tr v-for="item in userlist">\
                    <td v-text="item.userName"></td>\
                    <td v-text="item.loginName"></td>\
                    <td v-text="item.email"></td>\
                    <td><a class="btn btn-danger" @click="deleteuser" :id="item.id">delete</a></td>\
                </tr>\
            </tbody>\
        </table>\
        ',
        methods:{
            deleteuser:function (t) {
                let form = commonData();
                form.append("userId",t.target.id);
                fetch('/api/user/delete',{method:'post',body:form}).then(function(response) {
                    if (response.redirected){
                        let tmpJson = {};
                        tmpJson.statusCode = 500;
                        return tmpJson;
                    }
                    return response.json();
                }).then(function(json) {
                    if (json.statusCode ===200){
                        //refresh this page
                        $('#userlistpage').pagination($('#userlistpage').pagination('getSelectedPageNum'))
                    }else {
                        tips("error","delete fail");
                    }
                }).catch(function(ex) {
                    tips("error",ex);
                });
            }
        }
    });


    // 定义名为 sysconfigdiv 的新组件
    Vue.component('sysconfigdiv', {
        // sysconfigdiv 组件现在接受一个
        // 这个属性名为 sysconfiglist。
        props: ['sysconfiglist'],
        template: '\
        <table class="table">\
            <thead>\
                <tr>\
                    <th>#</th>\
                    <th>#</th>\
                    <th>#</th>\
                    <th>#</th>\
                </tr>\
            </thead>\
            <tbody>\
                <tr v-for="item in sysconfiglist">\
                    <td v-text="item.key"></td>\
                    <td><input type="text" maxlength="64" v-model="item.value" class="form-control"/></td>\
                    <td v-text="item.comments"></td>\
                    <td><a class="btn btn-info" @click="update" :id="item.id">update</a></td>\
                </tr>\
            </tbody>\
        </table>\
        ',
        methods:{
            update:function (t) {
                this.$emit("update",t.target.id);
            }
        }
    });

    // 定义名为 sysstatusdiv 的新组件
    Vue.component('sysstatusdiv', {
        // sysstatusdiv 组件现在接受一个
        // 这个属性名为 sysstatuslist。
        props: ['sysstatuslist'],
        template: '\
        <table class="table">\
            <thead>\
                <tr>\
                    <th>#</th>\
                    <th>#</th>\
                    <th>#</th>\
                    <th>#</th>\
                </tr>\
            </thead>\
            <tbody>\
                <tr v-for="item in sysstatuslist">\
                    <td v-text="item.key"></td>\
                    <td v-text="item.value"></td>\
                    <td v-text="item.comments"></td>\
                    <td><a class="btn btn-danger" @click="deletestatus" :id="item.id">delete</a></td>\
                </tr>\
            </tbody>\
        </table>\
        ',
        methods:{
            deletestatus:function (t) {
                this.$emit("deletestatus",t.target.id);
            }
        }
    });


    // 定义名为 categoriesdiv 的新组件
    Vue.component('categoriesdiv', {
        // categoriesdiv 组件现在接受一个
        // 这个属性名为 categorylist。
        props: ['categorylist'],
        template: '\
        <table class="table">\
            <thead>\
                <tr>\
                    <th>#</th>\
                    <th>#</th>\
                    <th>#</th>\
                    <th>#</th>\
                </tr>\
            </thead>\
            <tbody>\
                <tr v-for="item in categorylist">\
                    <td v-text="item.id"></td>\
                    <td><input type="text" maxlength="12" v-model="item.category" class="form-control"></td>\
                    <td><a class="btn btn-warning" @click="updatecategory(item)">update</a></td>\
                    <td><a class="btn btn-danger" @click="deletecategory(item)">delete</a></td>\
                </tr>\
            </tbody>\
        </table>\
        ',
        methods:{
            updatecategory:function (c) {
                this.$emit('updatecategory',c);
            },
            deletecategory:function (c) {
                this.$emit('deletecategory',c);
            }
        }
    });

    // 定义名为 categoriesselectdiv 的新组件
    Vue.component('categoriesselectdiv', {
        // categoriesselectdiv 组件现在接受一个
        // 这个属性名为 categorylist。
        props: ['categorylist'],
        template: '\
        <div class="form-group">\
            <label for="categoryid" class="col-sm-2 control-label"><span v-text="$t(\'lang.categories\')"></span>:</label>\
            <div class="col-sm-10">\
                <select class="form-control" id="categoryid" name="categoryid">\
                    <option v-if="item.id!=\'default\'" v-for="item in categorylist" :value="item.id"><span v-text=item.category></span></option>\
                </select>\
            </div>\
        </div>\
        ',
        methods:{
            updatecategory:function (c) {
                this.$emit('updatecategory',c);
            },
            deletecategory:function (c) {
                this.$emit('deletecategory',c);
            }
        }
    });


    //tips
    // 定义名为 categorydiv 的新组件
    Vue.component('tipsmodaldiv', {
        // categorydiv 组件现在接受一个
        // 这个属性名为 category。
        props: [],
        template: '\
       <div class="modal fade" id="tipsModal" tabindex="-1" role="dialog" aria-labelledby="tipsModalLabel">\
            <div class="modal-dialog" role="document">\
                <div class="modal-content">\
                    <div class="modal-header">\
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
                        <h4 class="modal-title" id="tipsModalLabel">Modal title</h4>\
                    </div>\
                    <div class="modal-body" id="tipsModelBody">\
                        ...\
                    </div>\
                <div class="modal-footer">\
                    <!--<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>-->\
                    <!--<button type="button" class="btn btn-primary">Save changes</button>-->\
                </div>\
            </div>\
        </div>\
    </div>\
        '
    });

});