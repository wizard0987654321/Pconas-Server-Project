import { useCallback, useLayoutEffect, useRef, useState, type RefObject } from "react";

// Shared logic for drawing cables between equipment icons (used in DetailedRoom and CableChangeOverlay)

// One cable that should be drawn, IDs are Equipment IDs
export type LineInput = {
    key: string;
    fromId: number;
    toId: number;
    color: string;
    dashed?: boolean;
};

// Same cable with calculated coordinates, relative to the lines container
export type LineCoordinates = {
    key: string;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    color: string;
    dashed?: boolean;
};

// Refs of every equipment icon, keyed by Equipment ID.
// Usage: <img ref={setEquipmentRef(rack.ID)} />
export function useEquipmentRefs() {
    const equipmentRefs = useRef<Map<number, HTMLElement>>(new Map());

    const setEquipmentRef = useCallback(
        (equipmentId: number) => (el: HTMLElement | null) => {
            if (el) equipmentRefs.current.set(equipmentId, el);
            else equipmentRefs.current.delete(equipmentId);
        },
        []
    );

    return { equipmentRefs, setEquipmentRef };
}

// Calculates line coordinates from the real positions of the icons.
// `connections` must be memoized by the caller (useMemo), otherwise this recalculates on every render.
// `layoutDeps`: data whose change moves icons around (e.g. racks list), triggers a recalculation.
export function useConnectionLines(
    containerRef: RefObject<HTMLElement | null>,
    equipmentRefs: RefObject<Map<number, HTMLElement>>,
    connections: LineInput[],
    layoutDeps: readonly unknown[] = []
) {
    const [lines, setLines] = useState<LineCoordinates[]>([]);

    useLayoutEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const calculateLines = () => {
            const box = container.getBoundingClientRect();
            const newLines: LineCoordinates[] = [];

            connections.forEach(connection => {
                const from = equipmentRefs.current.get(connection.fromId)?.getBoundingClientRect();
                const to = equipmentRefs.current.get(connection.toId)?.getBoundingClientRect();

                // Equipment not rendered (yet), skip that cable
                if (!from || !to) return;

                // Line goes from the edge of one icon to the facing edge of the other one
                const fromIsAbove = from.top + from.height / 2 <= to.top + to.height / 2;

                newLines.push({
                    key: connection.key,
                    x1: from.left + from.width / 2 - box.left,
                    y1: (fromIsAbove ? from.bottom : from.top) - box.top,
                    x2: to.left + to.width / 2 - box.left,
                    y2: (fromIsAbove ? to.top : to.bottom) - box.top,
                    color: connection.color,
                    dashed: connection.dashed,
                });
            });

            setLines(newLines);
        };

        calculateLines();

        // Recalculate when the layout changes (window resize, images finishing loading, rows wrapping)
        const resizeObserver = new ResizeObserver(calculateLines);
        resizeObserver.observe(container);
        window.addEventListener("resize", calculateLines);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener("resize", calculateLines);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [containerRef, equipmentRefs, connections, ...layoutDeps]);

    return lines;
}
