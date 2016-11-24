# guppy

# 简介
可以生成一个一个子类,定义其实例的一些方法,并定义其方法会触发到的事件,在子类生成实例时可以定义方法并绑定到事件中.

# 例子
        `var guppy = Guppy.extend({
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

