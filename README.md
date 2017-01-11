# 简介

事件生成器

可定义子类的原型方法,并触发相应事件,在子类生成的实例时可以定义方法并绑定到事件中.

# 例子

        `var List = Guppy.extend({
            defaultOptions: {
                init: function() {
                    this.data = [];
                }.$on("init")
            },
            push: funcition(value){
                this.data.push(value)
                this.trigger('push', value,this.data);
            },
            length: function(){
                return this.data.length;
            }
        });`
        `var list = new List({
            onInit: function(){
            }.$on("init"),
            onPush: function(data, rest) {
                console.log("push",data, rest);
            }.$on("push")
        });`
        `list.push("2");`   // log:   'push',"2",["2"]
        `list.length();`  // return 1

