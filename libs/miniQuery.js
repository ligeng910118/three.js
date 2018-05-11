(function(win){
/*
   var miniQuery = function(){
    alert('Hello miniQuery!');
   }

   win.miniQuery = miniQuery;
*/   

	
   var initScene = function()
    {
    	return new THREE.Scene();
    }
   
   var initStats = function (DivID) {
       stats = new Stats();
       stats.setMode(0); // 0: fps, 1: ms
       // Align top-left
       stats.domElement.style.position = 'absolute';
       stats.domElement.style.left = '0px';
       stats.domElement.style.top = '0px';
       document.getElementById(DivID).appendChild(stats.domElement);
       return stats;
   }
   
   var initRenderer = function(color = new THREE.Color(0xEEEEEE),shadow = true)
   {
   		var renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(color);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMapEnabled = shadow;
        renderer.shadowMapType = THREE.PCFShadowMap;
   		return renderer;
   }
   
   var initMoreRenderer = function(color = new THREE.Color(0xEEEEEE),shadow = true,option)
   {
	   var initMoreRenderer = initRenderer(color = new THREE.Color(0xEEEEEE),shadow = true);
	   for(var k in option)
		   initMoreRenderer.k = option.k;
	   return initMoreRenderer;
   }
   
   var initCamera = function(scene,position = {x:-30,y:40,z:30},lookAtPosition = false)
   {
   	 // create a camera, which defines where we're looking at.
   	 var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        // position and point the camera to the center of the scene
        camera.position.x = position.x;
        camera.position.y = position.y;
        camera.position.z = position.z;
        if(lookAtPosition){
        	camera.lookAt(lookAtPosition);
        } else{
        	camera.lookAt(scene.position);
        }       	
        return camera;
   }
   
   var getWebGLOutPut = function(DivID,renderer)
   {
   		document.getElementById(DivID).appendChild(renderer.domElement);
   }
   
   var render = function() {
       stats.update();
       // rotate the cubes around its axes
       animatorAction();
       // render using requestAnimationFrame
       requestAnimationFrame(render);
       renderer.render(scene, camera);
   }
   
   var addAxes = function(scene)
   {
   		var axes = new THREE.AxisHelper(20);
        scene.add(axes);
   }
   
   var addPointLight = function(scene,position,shadowBool)
   {    
       return [ambiColorLight(scene),spotLight(scene,position,shadowBool)];
   }
   
   var ambiColorLight = function(scene,ambiColor = "#0c0c0c")
   {
   	   var ambientLight = new THREE.AmbientLight(ambiColor);
       scene.add(ambientLight); 
       return ambientLight;
   }
   
   var spotLight = function(scene,position,shadowBool,light="#ffffff")
   {
	   var spotLight = new THREE.SpotLight(light);
       spotLight.position.set(position.x,position.y,position.z);
       spotLight.castShadow = shadowBool;
       scene.add(spotLight);
       return spotLight;
   }
   
   var spotMoreLight = function(scene,position,shadowBool,option,light ="#ccffcc")
   {
	   var spotLight = new THREE.SpotLight(light);
       spotLight.position.set(position.x,position.y,position.z);
       spotLight.castShadow = shadowBool;
       spotLight.shadowCameraNear =option.shadowCameraNear;
       spotLight.shadowCameraFar =option.shadowCameraFar;
       spotLight.shadowCameraFov =option.shadowCameraFov;
       spotLight.target =option.target;
       spotLight.angle =option.angle;
       scene.add(spotLight);
       return spotLight;
   }
   
   var pointLight = function(scene,distance,pointColor ="#ccffcc")
   {
       var pointLight = new THREE.PointLight(pointColor);
       pointLight.distance = distance;
       scene.add(pointLight);
       return pointLight;
   }
   

   
   var addPlaneGeometry = function(scene)
   {
   	   var planeGeometry = new THREE.PlaneGeometry(60, 20);
       var planeMaterial = new THREE.MeshBasicMaterial({color: 0xcccccc});
       plane = new THREE.Mesh(planeGeometry, planeMaterial);
       // rotate and position the plane
       plane.rotation.x = -0.5 * Math.PI;
       plane.position.x = 15;
       plane.position.y = 0;
       plane.position.z = 0;
       // add the plane to the scene
       plane.receiveShadow = true;
       scene.add(plane);
   }
   
   var customeFastGeometry = function(scene,geometry,material,position,shadowBool)
   {
	   var geometryObj = new THREE.Mesh(geometry,material);
	   geometryObj.rotation.x = -0.5 * Math.PI;
       geometryObj.position.x = position.x;
       geometryObj.position.y = position.y;
       geometryObj.position.z = position.z;
       geometryObj.castShadow = shadowBool;
       // add the cube to the scene
       scene.add(geometryObj);
       return geometryObj;
   }
   
   var customPlaneGeometry = function(scene,geometry,material,position,shadowBool)
   {
       plane = new THREE.Mesh(geometry, material);
       // rotate and position the plane
       plane.rotation.x = -0.5 * Math.PI;
       plane.position.set = ({x:position.x,y:position.y,z:position.z});
       // add the plane to the scene
       plane.receiveShadow = shadowBool;
       scene.add(plane);
   }
   

   
   var addGeometry = function(scene,geometry,material,position,shadowBool)
   {
       return customeFastGeometry(scene,geometry,material,position,shadowBool);
   }
   
   var foggy = function(scene,color,intends,distance)
   {
	   scene.fog = new THREE.Fog(color, intends, distance);
   }
   
   var forcedMaterial = function(scene,color)
   {
	   scene.overrideMaterial = new THREE.MeshLambertMaterial({color: color});
   }
   
   var customGeometry = function(vertices,faces)
   {
       var geom = new THREE.Geometry();
       geom.vertices = vertices;
       geom.faces = faces;
       geom.computeFaceNormals();
       var materials = [
           new THREE.MeshLambertMaterial({opacity: 0.6, color: 0x44ff44, transparent: true}),
           new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true})
       ];
       mesh = THREE.SceneUtils.createMultiMaterialObject(geom, materials);
       mesh.children.forEach(function (e) {
           e.castShadow = true
       });
       scene.add(mesh);       
   }

   var addControl = function(gui,controls,name,start,end)
   {
       guiFolder = gui.addFolder(name);
       guiFolder.add(controls, name+'X', start, end);
       guiFolder.add(controls, name+'Y', start, end);
       guiFolder.add(controls, name+'Z', start, end);
   }
   
   var addControlAndAction = function(gui,controls,name,start,end,action)
   {
       guiFolder = gui.addFolder(name);
       guiFolder.add(controls, name+'X', start, end);
       guiFolder.add(controls, name+'Y', start, end);
       guiFolder.add(controls, name+'Z', start, end);
       guiFolder.add(controls, action);
   }
   
   var addPosition = function(gui,controls,name,start,end,object)
   {
       guiPosition = gui.addFolder(name);
       var contX = guiPosition.add(controls, name+'X', start,end);
       var contY = guiPosition.add(controls, name+'Y', start,end);
       var contZ = guiPosition.add(controls, name+'Z', start,end);

       contX.listen();
       contX.onChange(function (value) {
    	   object.position.x = controls.positionX;
       });

       contY.listen();
       contY.onChange(function (value) {
    	   object.position.y = controls.positionY;
       });

       contZ.listen();
       contZ.onChange(function (value) {
    	   object.position.z = controls.positionZ;
       });

   }
   
   var lightControl = function(light)
   {
       var gui = new dat.GUI();
       gui.addColor(controls, 'ambientColor').onChange(function (e) {
           light[0].color = new THREE.Color(e);
       });
       gui.add(controls, 'disableSpotlight').onChange(function (e) {
           light[1].visible = !e;
       });
   }
   
   var customPoints = function(points)
   {
       var spGroup = new THREE.Object3D();
       points.forEach(ponitValues=>{
           var spMesh = new THREE.Mesh(
           		new THREE.SphereGeometry(0.2), 
           		new THREE.MeshBasicMaterial({color: 0xff0000, transparent: false})
           		);
           spMesh.position.copy(ponitValues);
           spGroup.add(spMesh);
       });
       // add the points as a group to the scene
       scene.add(spGroup);
       return spGroup;
   }
   
   var ceateGeometry = function(Geometry,FaceOptions,LineOptions) {
       var mesh = THREE.SceneUtils.createMultiMaterialObject(
    		Geometry, 
       		[FaceOptions, LineOptions]
       );
       return mesh;
   }
   
   var objectXYZ = function(gui,controls,name,obj)
   {
       var Folder = gui.addFolder(name);
       Folder.add(controls, name+"PosX", -20, 20).onChange(function (e) {
    	   obj.position.x = e;
       });
       Folder.add(controls, name+"PosZ", -20, 20).onChange(function (e) {
    	   obj.position.z = e;
       });
       Folder.add(controls, name+"PosY", -20, 20).onChange(function (e) {
    	   obj.position.y = e;
       });
       Folder.add(controls, name+"Scale", 0, 3).onChange(function (e) {
    	   obj.scale.set(e, e, e);
       });
   }
   
   var trackballControls = function(scene)
   {
	   trackballControls = new THREE.TrackballControls(camera);
       trackballControls.rotateSpeed = 1.0;
       trackballControls.zoomSpeed = 1.0;
       trackballControls.panSpeed = 1.0;
       trackballControls.staticMoving = true;
       return trackballControls;
   }
 //standard name
	win.initScene = initScene;
	win.initStats = initStats;
	win.render = render;
	win.getWebGLOutPut = getWebGLOutPut;
	win.addAxes = addAxes;
	win.addPointLight = addPointLight;
	win.addPlaneGeometry = addPlaneGeometry;
	win.initRenderer = initRenderer;
	win.initCamera = initCamera;
	win.addGeometry = addGeometry;
	win.foggy = foggy;
	win.customGeometry = customGeometry;
	win.addControl = addControl;
	win.addControlAndAction = addControlAndAction;
	win.addPosition = addPosition;
	win.lightControl = lightControl;
	win.customGeometry = customGeometry;
	win.customPlaneGeometry = customPlaneGeometry;
	win.customeFastGeometry = customeFastGeometry;
	win.ambiColorLight = ambiColorLight;
	win.spotLight = spotLight;
	win.pointLight = pointLight;
	win.spotMoreLight = spotMoreLight;
	win.initMoreRenderer = initMoreRenderer;
	win.customPoints = customPoints;
	win.ceateGeometry = ceateGeometry;
	win.objectXYZ = objectXYZ;
	win.trackballControls = trackballControls;
})(window);