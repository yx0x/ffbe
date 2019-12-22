"auto";
let path = "img/";
let options = ["自然恢复", "道具恢复"]
let mode = dialogs.select("体力恢复模式", options);
if(mode >= 0){
    toast("选择的是" + options[mode]);
}else{
    exit();
}
let queding=images.read(path+"queding.jpg");
let daojv=images.read(path+"daojv.jpg");
let huifu=images.read(path+"huifu.jpg");
let tili=images.read(path+"tili.jpg");
let fanhui=images.read(path+"fanhui.jpg");
let bushenqing=images.read(path+"bushenqing.jpg");
let shi=images.read(path+"shi.jpg");
let guanbi=images.read(path+"guanbi.jpg");
initConfig();
let arr = initPosition();
let config={
    region: [0, 50],
    threshold: 0.8
}
while(true){
    for(i = 0; i < arr.length; i++){
        console.log(arr[i].img)
        let find = detect(arr[i].img);
        if(find){
             sleep( 1000);
            toast(arr[i].name);
            if(arr[i].click){
                click(arr[i].click.x,arr[i].click.y);
            }else{
                click(find.x+20,find.y+20);
            }
            sleep(2 * 1000);
        }else{
            if(arr[i].id==2){
                let hf=detect(daojv);
                if(hf){
                    //没体力了
                    if(mode==1){
                        click(hf.x,hf.y);
                        resume();
                    }else{
                        click(hf.x+200,hf.y+200);
                        i--;
                        sleep(1 * 1000);
                    }
                    i--;
                    continue;
                }else{
                    sleep(2 * 1000);
                    i--;
                    continue;
                }
            }else if(arr[i].id==1){
                let bushenqingButton=detect(bushenqing);
                if(bushenqingButton){//添加同行
                    click(bushenqingButton.x,bushenqingButton.y);
                }else{//每日课题
                    let guanbiButtion = detect(guanbi);
                    if(guanbiButtion){
                        click(guanbiButtion.x,guanbiButtion.y);
                    }
                }
                sleep(2 * 1000);
                i--;
                continue;
            }else if(arr[i].id==6){//升级
                click(device.width/2, device.height-300);
                sleep(2 * 1000);
                i--;
                continue;
            }else{
                sleep(2 * 1000);
                i--;
                continue;
            }
        }
    }
    sleep(2 * 1000);
}
//找图
function detect(image){
        let img = captureScreen();
        let point = findImage(img,image,config);
        return point;
}
//恢复体力
function resume(){
    sleep(2 * 1000);
    let img = captureScreen();
    let tiliIcon = findImage(img,tili,config);
    let point = findImage(img,huifu,config);
    if(point && tiliIcon){
        click(point.x+10,tiliIcon.y+50);
        sleep(2 * 1000);
        let img = captureScreen();
        let queding_point = findImage(img,queding,config);
        if(queding_point){
            click(queding_point.x,queding_point.y);
            sleep(2 * 1000);
            let img = captureScreen();
            let shi_point = findImage(img,shi,config);
            if(shi_point){
                click(shi_point.x,shi_point.y);
                sleep(2 * 1000);
                let img = captureScreen();
                let fanhui_point = findImage(img,fanhui,config);
                if(fanhui_point){
                    click(fanhui_point.x,fanhui_point.y);
                    return true;
                }
            }
        }else{
            toast("未找到确定按钮");
        }
    }else{
        toast("未找到恢复按钮");
    }
    return false;
}
function initConfig(){
    if(!requestScreenCapture(false)){
        toast("请求截图失败");
        exit();
    }
    setScreenMetrics(device.width, device.height);
}
function initPosition(){
    //神殿入口
    const enter={
        id:1,
        detect:"rukou",
        name:"神殿入口"
    };
    //下一步
    const next={
        id:2,
        detect:"next",
        name:"下一步"
    }
    //同行
    const friend={
        id:3,
        detect:"tongxing",
        name:"同行",
        click:{x:492,y:947}
    }
    //出发
    const go={
        id:4,
        detect:"chufa",
        name:"出发"
    }
    //自动
    const autoattack={
        id:5,
        detect:"auto",
        name:"自动"
    }
    //跳过结算
    const jump={
        id:6,
        name:"跳过结算",
        detect:"jump"
    }
    let arr =new Array();
    arr.push(enter);
    arr.push(next);
    arr.push(friend);
    arr.push(go);
    arr.push(autoattack);
    arr.push(jump);
    for(item in arr){
        arr[item].img=images.read(path+arr[item].detect+".jpg");
    }
    return arr;
}