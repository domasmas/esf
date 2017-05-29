import { Component, Input, Output } from '@angular/core';
@Component({
    selector: 'vertical-split-view',
    templateUrl: '/App/shared/layout/verticalSplitView/verticalSplitView.component.html',
})
export class VerticalSplitViewComponent {
    private view1Width: string;
    private view2Width: string;

    private isDragging: boolean;

    private containerNode: Node;

    constructor() {
        this.view1Width = "50%";
        this.view2Width = "50%"
        this.isDragging = false;
    }

    private onMouseDown(event: MouseEvent): void {
        this.startDragging(event);
    }

    private onMouseMove(event: MouseEvent): void {
        if (this.isDragging) {
            this.recalculateWidths(event);
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

    private recalculateWidths(event: MouseEvent): void {
        let parentOffsetLeft: number = (<any>this.containerNode).offsetLeft;
        let newWitdth1: number = (((event.clientX - parentOffsetLeft) / (<any>this.containerNode).clientWidth) * 100);
        let newWitdth2: number = 100 - newWitdth1;

        this.view1Width = `${newWitdth1}%`;
        this.view2Width = `${newWitdth2}%`;
    }
}