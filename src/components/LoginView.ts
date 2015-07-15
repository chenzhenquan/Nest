/**
 *
 * @author 
 *
 */
class LoginView extends egret.gui.SkinnableComponent {
	
    
    public info_txt: egret.gui.Label;
    
    public constructor() {
        super();
        this.skinName = skins.LoginSkin;
	}
	
	
	public createChildren(){
        super.createChildren();
        
        
        this.checkLogin();
        
       
        
	}
	
	private checkLogin():void{
        this.info_txt.text = "正在检查是否已登录...";
        var loginInfo: nest.user.LoginInfo = {};
        nest.user.checkLogin(loginInfo,this.onCheckLoginCallback.bind(this));
	}
	
	
	private onCheckLoginCallback(data:nest.user.LoginCallbackInfo):void {
	    
    	if (!data.token){
            this.info_txt.text = "正在登录...";
            var loginInfo: nest.user.LoginInfo = {};
            nest.user.login(loginInfo,this.onLoginCallback.bind(this));
    	}
    	else{
            this.onLoginCallback(data);
    	}
    	
	}
	
	private onLoginCallback(data:nest.user.LoginCallbackInfo):void{
	    
        if (data.result == 0){          
            this.getUserInfo(data,this.onGetUserInfoCallback);    
        }
        else{
            //登录失败
            this.info_txt.text = "正在获取用户信息...";
        }
    	
	}
	
	private onGetUserInfoCallback(data:any){
        console.log(data);
        this.info_txt.text = "正在进入游戏...";
	}
	
	private getUserInfo(data:nest.user.LoginCallbackInfo,onGetUserInfoCallback:Function){
    	
    	  //为了保证安全性，这段代码请务必放在服务器端实现
        this.info_txt.text = "正在获取用户信息...";
        var appId: number = 323;
        var appkey: string = "woBQUXxYqALA2xvjA9W3b";
        var token = data.token;
        var requestParams:any = {
            action: "user.getInfo",
            appId: appId,
            serverId: 1,
            time: Date.now(),
            token: token
                  
            };
            var signStr = "";
            for (var key in requestParams){
                signStr += key + "=" + requestParams[key];
            }
            signStr += appkey;
            requestParams.sign = new md5().hex_md5(signStr);;
                        
            var urlLoader: egret.URLLoader = new egret.URLLoader();
            var request: egret.URLRequest = new egret.URLRequest();            
            request.url = "http://api.egret-labs.org/games/api.php";
                        
            var variable: egret.URLVariables = new egret.URLVariables();        
            variable.variables = requestParams;
            request.data = variable;
                                    
            
                        
            request.method = egret.URLRequestMethod.POST;
            urlLoader.load(request);
            urlLoader.addEventListener(egret.Event.COMPLETE,function(e:egret.Event) {
                var data = JSON.parse(urlLoader.data);
                onGetUserInfoCallback.call(this,data);
            },this);
            
            
            
	}
}
