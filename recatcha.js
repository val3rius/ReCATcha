/**
 * ReCATcha
 *
 * ReCATcha is the latest and greatest in feline-focused spam reduction.
 * Simply include this javascript file at the bottom of your web page and then implement
 * our simple SDK on your server-side form validation and you'll be on your way to blockin'
 * cats all day erry day.
 *
 * Also you need to run recatcha.init({
 * 	URL: "your-api-endpoint"
 * })
 *
 * and add the "<div id="recatcha"></div>" hook into your form.
 *
 * But other than that, super ez pz right????
 *
 */
var recatcha = recatcha || {
	
	elems: {},

	/**
	 * init
	 * - look for our DOM hook, write the recatcha markup into it
	 * - set up settings stuff
	 * - do things
	 */
	init: function(opts) {

		this.opts = opts || {
			URL: "/api.php"
		}

		this.elems.wrap   = document.querySelector('#recatcha')
		this.elems.video  = document.createElement('video')
		this.elems.canvas = document.createElement('canvas')
		this.elems.field  = document.createElement('input')
		this.elems.btn    = document.createElement('a')
		
		this.ctx = this.elems.canvas.getContext('2d')

		this.elems.wrap.style.width = "300px"
		this.elems.wrap.style.background = "#f9f9f9"
		this.elems.wrap.style.border = "1px solid #d3d3d3"
		this.elems.wrap.style.borderRadius = "3px"
		this.elems.wrap.style.position = "relative"
		this.elems.wrap.style.margin = "15px"
		

		this.elems.video.autoplay = true
		this.elems.video.style.maxWidth = "90%"
		this.elems.video.style.display = "none"
		this.elems.video.style.padding = "15px 15px 0"

		this.elems.canvas.style.display = "none"
		this.elems.canvas.width = 400
		this.elems.canvas.height = 300
		
		this.elems.field.type = "hidden"
		this.elems.field.name = "recatcha"
		
		this.elems.btn.href = "#"
		this.elems.btn.text = "I am not a cat"
		this.elems.btn.addEventListener('click', this.startCam.bind(this)) //lol w/e
		this.elems.btn.style.color = "#333"
		this.elems.btn.style.fontFamily = "sans-serif"
		this.elems.btn.style.textDecoration = "none"
		this.elems.btn.style.margin = "15px"
		this.elems.btn.style.display = "block"
		this.elems.btn.style.whiteSpace = "nowrap"
		this.elems.btn.style.background = "#fff"
		this.elems.btn.style.border = "2px solid #ccc"
		this.elems.btn.style.borderRadius = "3px"
		this.elems.btn.style.width = "20px"
		this.elems.btn.style.height = "20px"
		this.elems.btn.style.textIndent = "30px"

		this.elems.wrap.appendChild(this.elems.video)
		this.elems.wrap.appendChild(this.elems.btn)
		this.elems.wrap.appendChild(this.elems.canvas)
		this.elems.wrap.appendChild(this.elems.field)

	},
	
	/**
	 * startCam
	 * Starts recording via the visitor webcam, then waits for three (3)
	 * seconds before running the setValue method
	 */
	startCam: function() {
		this.elems.btn.text = "Looking for cats..."

		navigator.getUserMedia = navigator.getUserMedia ||
			navigator.webkitGetUserMedia || navigator.mozGetUserMedia || 
			navigator.msGetUserMedia

		this.elems.video.style.display = "block"

		if (navigator.getUserMedia) {
			navigator.getUserMedia({audio:false, video:true},
				function(stream){
					this.stream = stream
					this.elems.video.src = window.URL.createObjectURL(stream)
				}.bind(this), function(err) {
					console.log(err)	
				})
		}

		setTimeout(this.setValue.bind(this), 3000)
	},
	
	/**
	 * setValue
	 * Takes a dump of the current picture in the reCATcha video element, fills out
	 * the input field for server-side validation as well as runs it through the
	 * ajax call for near-instant response
	 */
	setValue: function() {
		if (this.stream) {
			this.ctx.drawImage(this.elems.video, 0, 0, this.elems.canvas.width,
				this.elems.canvas.height)
			this.elems.field.value = this.elems.canvas.toDataURL('image/jpeg')
			this.stream.getVideoTracks()[0].stop();
		}
		this.elems.video.style.display = "none"

		this.ajaxCheck(this.elems, this.opts)
	},
	
	/**
	 * ajaxCheck
	 * ...it does an ajax-based check. :SSS
	 */
	ajaxCheck: function(els, opts) {
		xhr = new XMLHttpRequest()
		xhr.open('POST', opts.URL, true)
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
		xhr.onload = function() {
    		console.log(this.responseText)
			resp = JSON.parse(this.responseText)
			if (resp.response !== "not_cat") {
				els.btn.text = "X It seems like you are a cat"
			} else {
				els.btn.text = "It seems like you're not a cat"
			}
		};
		xhr.send('recatcha='+encodeURIComponent(els.field.value))
	}
}

