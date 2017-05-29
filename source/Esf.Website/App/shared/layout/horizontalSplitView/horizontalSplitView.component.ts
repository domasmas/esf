import { Component, Input, Output } from '@angular/core';
@Component({
    selector: 'horizontal-split-view',
    templateUrl: '/App/shared/layout/horizontalSplitView/horizontalSplitView.component.html',
})
export class HorizontalSplitViewComponent {
    private view1Height: string;
    private view2Height: string;

    private isDragging: boolean;

    private containerNode: Node;

    constructor() {
        this.view1Height = "50%";
        this.view2Height = "50%"
        this.isDragging = false;
    }

    private onMouseDown(event: MouseEvent): void {
        this.startDragging(event);
    }

    private onMouseMove(event: MouseEvent): void {
        if (this.isDragging) {
            this.recalculateHeigths(event);
        }
    }

    private onMouseUp(event: MouseEvent): void {
        this.stopDragging(event);
    }

    private onMouseLeave(event: MouseEvent): void {
        this.stopDragging(event);
    }
    
    private startDragging(event: MouseEvent): void {
        this.isDragging = true;
        this.containerNode = event.srcElement.parentNode;
    }

    private stopDragging(event: MouseEvent): void {
        this.isDragging = false;
        this.containerNode = null;
    }

    private recalculateHeigths(event: MouseEvent): void {
        let parentOffsetTop: number = (<any>this.containerNode).offsetTop;
        let newHeight1: number = (((event.clientY - parentOffsetTop) / (<any>this.containerNode).clientHeight) * 100);
        let newHeight2: number = 100 - newHeight1;

        this.view1Height = `${newHeight1}%`;
        this.view2Height = `${newHeight2}%`;
    }
}