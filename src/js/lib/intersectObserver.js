class intersectObserver{

	constructor(el, threshold, enterCallback, leaveCallback){

		const observer = new window.IntersectionObserver(([entry]) => {
			if(entry.isIntersecting){
				enterCallback(entry.target);
			}else{
				leaveCallback(entry.target);
			}
		}, {
			root: null,
			threshold: threshold
		});

		observer.observe(el);
	}
}

export default intersectObserver;