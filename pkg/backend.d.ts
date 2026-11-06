/* tslint:disable */
/* eslint-disable */

/**
 * Facade for the backend WASM module.
 *
 * The class exposes a simplified interface for the backend system, handling node management and parameter passing.
 */
export class BackendFacade {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Adds a lone UGP that is a jump. Creates a new node that holds just this UGP and a `discrete_shape_gen`.
     *
     * ## Parameters:
     *
     * - **x**: point x value (float)
     * - **y**: point y value (float)
     *
     * **Returns**: a handle representing the id of the Node that that was just registered.
     * This handle will be used to reference it in the future.
     * Note that because there is just the UGP alone in this node, we don't need its handle
     */
    add_jump_ugp(x: number, y: number): Handle;
    /**
     * Add a node to the DAG.
     *
     * ## Parameters:
     *
     * - **ports**: the number of ports for the node,
     * - **operation**: the number specifying the generator function index
     * - **params**: and a list of 5 parameters of type float. This is where you would indicate the spacing parameter.
     * If more than five parameters are given, the additional ones are ignored
     */
    add_node(ports: number, operation: number, params: Float32Array): Handle;
    /**
     * Register a UGP with the backend.
     *
     * ## Parameters:
     *
     * - **x**: point x value (float)
     * - **y**: point y value (float)
     *
     * **Returns**: a handle representing the id of the UGP that was just registered.
     * This handle will be used to reference it in the future.
     * Note that this function does not associate a UGP with any node.
     */
    add_ugp(x: number, y: number): Handle;
    /**
     * Generates a cubic Bezier curve based on the input points and stitch length.
     * The bezier curve appears as a series of evenly spaced points along the curve.
     * The curve is evaluated using a precomputed Look Up Table (LUT) for efficiency.
     *
     * - **Port 0**: start point
     * - **Port 1**: control point 1
     * - **Port 2**: control point 2
     * - **Port 3**: end point
     * - **Param 0**: spacing between points
     */
    bezier_gen(): number;
    /**
     * Bind a UGP to a specific port of a node.
     *
     * ## Parameters:
     *
     * - **node_id**: a handle that corresponds to the node
     * - **port**: the port number that the UGP will be bound to
     * - **ugp_id**: the handle of the UGP to be bound
     */
    bind_ugp(node_id: Handle, port: number, ugp_id: Handle): void;
    /**
     * Generates points along a circle centered at the first input point,
     * with radius determined by the distance to the second input point.
     *
     * - **Port 0**: Center point (first point used)
     * - **Port 1**: Radius point (first point used to calculate distance from center)
     * - **Param 0**: Spacing between points (distance between consecutive points)
     *
     * Returns error if prerequisites not met, or issue with radius and spacing input
     */
    circle_gen(): number;
    /**
     * Create a directed edge in the DAG from a source node to the port of a target node.
     * Conceptually, it means that the output of the source node will be used as part of the input of the target node.
     *
     * ## Parameters:
     *
     * - **source**: a handle corresponding to the source node
     * - **target**: a handle corresponding to the target node
     * - **port**: the port number that of the target node.
     */
    connect_nodes(source: Handle, target: Handle, port: number): void;
    /**
     * Tiles a pattern shape along a polyline by fitting one copy per segment.
     *
     * - **Port 0**: pattern shape points
     * - **Port 1**: path polyline points (one copy of the pattern is placed per consecutive pair)
     *
     * Returns an error if either port is empty.
     */
    copy_between_gen(): number;
    /**
     * Deserializes a DAG string into the backend's internal state and re-creates the DAG.
     *
     * This function is intended for use in loading a DAG state from disk or receiving it over a network.
     * The frontend should use the [`serialize_dag`] function to obtain the string representation of the DAG state.
     *
     * This function will clear the current DAG state before deserializing the new one.
     */
    deserialize_dag(data: string): void;
    /**
     * Remove the directed edge in the DAG that exists between two nodes.
     *
     * ## Parameters:
     *
     * - **souce**: a handle corresponding to the source node of the edge to be removed.
     * - **target**: a handle corresponding to the target node of the edge to be removed.
     * - **port**: the port number that the edge was established on in the target node.
     */
    disconnect_nodes(source: Handle, target: Handle, port: number): void;
    /**
     * Generates a discrete shape from a set of points.
     *
     * It iterates through its input points and duplicates them 1-to-1 into the output buffer.
     * This generator does not close the polygon by default.
     * To close the polygon, the starting point must be duplicated at the end.
     *
     * - **Port 0**: discrete shape points (x, y)
     *
     * Returns error if prerequisites not met
     */
    discrete_shape_gen(): number;
    /**
     * Returns the raw DST format bytes for the shapes from the last `run()`, stitched in the
     * order the caller asks for.
     *
     * ## Parameters:
     *
     * - **order**: a flat `[slot, generation, slot, generation, ...]` array of terminal node
     *     handles — the same flattening `shape_array()` uses.
     *
     * This is the complete list of what gets stitched, not just its sequence:
     * a shape the array does not name is left out of
     * the file.
     *
     * Handles that no longer resolve to a shape are skipped, a repeated handle
     * stitches once, and an empty array produces a stitchless file. To export everything,
     * pass the first two `u32`s of every `shape_array()` entry.
     */
    export_dst(order: Uint32Array): Uint8Array;
    /**
     * Fills a closed outline with parallel rows of stitching (scanline fill).
     *
     * Rows alternate direction (serpentine): row *k* is stitched left-to-right, row *k+1*
     * right-to-left, so consecutive rows don't need a jump back across the shape. The outline
     * is closed automatically if its last point doesn't already match its first. Concave shapes
     * need no special handling: a row that straddles a notch simply produces more than one span.
     *
     * - **Port 0**: outline points, in order
     * - **Param 0**: `row_spacing` — distance between rows
     * - **Param 1**: `stitch_length` — distance between points along a row
     * - **Param 2**: `angle` — fill direction, in radians
     *
     * Returns an error if the outline has fewer than 3 points, if it contains a non-finite
     * coordinate, if `row_spacing` or `stitch_length` is not positive, or if either spacing is
     * so small relative to the shape that the output would blow past `MAX_ROWS` /
     * `MAX_POINTS_PER_ROW`.
     *
     * ## Known limitation: row-to-row travel stitches
     *
     * Serpentine ordering keeps the move from the end of one row to the start of the next short
     * *when the outline's width is stable between those rows*. It does not when the outline steps
     * horizontally. On a "T", stem rows span `[9,11]` and bar rows span `[0,20]`: the last stem
     * row ends at x=11 and the first bar row starts at x=20, so the connecting stitch runs 9 units
     * across the notch corner, outside the shape — visible thread over bare fabric.
     *
     * That gap is below `JUMP_GAP_THRESHOLD` at typical scales, so it is stitched rather than
     * trimmed, which is the lesser evil but still wrong. The real fix is travel-stitching along
     * the boundary between rows instead of moving in a straight line, which is out of scope for
     * this phase. Known ceiling of naive scanline fill.
     */
    fill_gen(): number;
    /**
     * Get the generator of a node.
     *
     * ## Parameters:
     *
     * - **handle**: a handle corresponding to the node whose operation is needed.
     *
     * **Returns**: a number that corresponds to a specific generator of the node — the
     * operation index into the `GENERATORS` array.
     */
    get_node_operation(handle: Handle): number | undefined;
    /**
     * Get the list of parameters of a node.
     *
     * ## Parameters:
     *
     * - **handle**: the handle of the node to look at.
     *
     * **Returns**: an array of floats corresponding to the parameters of the node. Null if the handle is invalid.
     */
    get_node_params(handle: Handle): Float32Array | undefined;
    /**
     * Returns the x-coordinate of a UGP.
     *
     * ## Parameters:
     *
     * - **handle**: the handle of the UGP to look at.
     *
     * **Returns**: the UGP's x value, or `None` if the handle is invalid.
     */
    get_ugp_x(handle: Handle): number | undefined;
    /**
     * Groups two input point sequences together, with the first sequence ending at the jump point.
     *
     * - **Port 0**: first point sequence
     * - **Port 1**: second point sequence
     *
     * The output will contain all the points from both `Port 0` and `Port 1`, with the first point of `Port 1` marked as a jump ending point.
     *
     * Returns an error if prerequisites are not met.
     */
    group_gen(): number;
    /**
     * Passes the input points directly to the output.
     *
     * - **Port 0**: List of points to pass through.
     */
    identity_gen(): number;
    /**
     * Returns the number of interpolated points (IPs) that the DAG generated.
     */
    ips_len(): number;
    /**
     * Returns a view of the float array that corresponds to the x values of all the IPs.
     */
    ips_x(): Float32Array;
    /**
     * Returns a view of the float array that corresponds to the y values of all the IPs.
     */
    ips_y(): Float32Array;
    is_jump_stitch(index: number): boolean;
    /**
     * Takes a list of points and connects them with new points forming lines.
     * Could be thought of as a running stitch for straight segments.
     *
     * - **Port 0**: List of points to connect.
     * - **Param 0**: spacing between interpolated points
     *
     * Returns error if prerequisites not met
     */
    line_fill_gen(): number;
    /**
     * Generates evenly spaced points along a line from two endpoints points.
     *
     * - **Port 0**: start point (x, y)
     * - **Port 1**: end point (x, y)
     * - **Param 0**: spacing between interpolated points
     *
     * Returns error if prerequisites not met
     */
    line_gen(): number;
    constructor();
    /**
     * Generates a rectangle shape from the top-left and bottom-right points.
     *
     * - **Port 0**: top-left point
     * - **Port 1**: bottom-right point
     *
     * Returns an error if prerequisites are not met.
     */
    rect_gen(): number;
    /**
     * Remove a node from the DAG.
     *
     * ## Parameters:
     *
     * - **handle**: the handle of the node to remove
     */
    remove_node(handle: Handle): void;
    /**
     * Discard a UGP in the backend.
     *
     * ## Parameters:
     *
     * - **handle**: the handle of the UGP to remove.
     */
    remove_ugp(handle: Handle): void;
    /**
     * Resamples a path to a given target spacing, with optional corner threshold for sharp turns.
     *
     * - **Port 0**: The path to resample.
     * - **Param 0**: The target spacing between resampled points.
     * - **Param 1**: The optional corner threshold in radians for detecting sharp turns. If this is left at 0.0, the corner threshold will be set to 45 degrees. If this threshold is not set correctly, the corners of the shape may end up getting rounded off.
     *
     * If the path to be resampled contains jumps, the generator will automatically resample each segment independently, and maintain the jumps.
     */
    resample_path_gen(): number;
    /**
     * Resets the DAG to an empty state, clearing all data.
     */
    reset(): void;
    /**
     * Rotates a shape around an anchor point.
     *
     * - **Port 0**: points of the shape
     * - **Port 1**: anchor point
     * - **Port 2**: rotation angle point
     *
     * Returns an error with insufficient input.
     */
    rotate_gen(): number;
    /**
     * Recalculate the DAG.
     *
     * Retrieve inputs, feed them through the DAG, re-run generator functions, then insert a
     * jump stitch between the end of each shape and the start of the next one so consecutive
     * shapes aren't connected by a stitch.
     * Everytime something in the DAG changes, this function needs to be called.
     */
    run(): void;
    /**
     * Marks an input point at a specific index as a jump point. The index will indicate the jump ending point.
     *
     * - **Port 0**: input points
     * - **Param 0**: jump end point index.
     *
     * The output will contain all the points in `Port 0`, with the point at index `Param 0` marked as a jump ending point.
     *
     * Returns an error if prerequisites are not met.
     */
    select_jump_gen(): number;
    /**
     * Serializes the current DAG state into a string representation.
     *
     * This function is intended for use in saving the DAG state to disk or transmitting it over a network.
     *
     * This function serializes the backend DAG state only. Any frontend state is not included in the final string.
     * The frontend is responsible for serializing its own state and using it in combination with this string.
     *
     * The output string of this function is a custom text format that can be parsed by the [`deserialize_dag`] function.
     * The frontend can use this string however it wants but it should not alter it
     * because it would cause the deserialization algorithm to fail later.
     */
    serialize_dag(): string;
    /**
     * Update the parameters of a node in the DAG.
     *
     * ## Parameters:
     *
     * - **handle**: the handle of the node whose parameters to update
     * - **params**: a float array of the 5 new parameters. If there are more than 5 they are ignored.
     */
    set_node_params(handle: Handle, params: Float32Array): void;
    /**
     * Returns a view of the shape array that corresponds to the shapes that the DAG generated.
     *
     * The `Shape` structs are flattened into a single `u32` array for efficiency. Each `Shape` is represented by 9 `u32` values.
     *
     * The reader of this array should interpret it as `[terminal_node_slot, terminal_node_generation, operation, points_offset, points_len, jumps_offset, jumps_len, colors_offset, colors_len]` and reconstruct the `Shape` structs from it.
     */
    shape_array(): Uint32Array;
    /**
     * Returns the number of shapes that the DAG generated.
     */
    shape_array_len(): number;
    /**
     * Unbind a UGP from all nodes it was bound to.
     *
     * ## Parameters:
     *
     * - **ugp_id**: the handle of the ugp to unbind
     */
    unbind_ugp_all(ugp_id: Handle): void;
    /**
     * Updates the number of ports on a node.
     *
     * ## Parameters:
     *
     * - **handle**: the handle of the node to update
     * - **ports**: the new number of ports for the node
     */
    update_node_ports(handle: Handle, ports: number): void;
    /**
     * Update the x and y values of a UGP.
     *
     * ## Parameters:
     *
     * - **handle**: the handle of the UGP to edit.
     * - **x**: new x value (float).
     * - **y**: new y value (float).
     */
    update_ugp(handle: Handle, x: number, y: number): void;
}

/**
 * A bit-packed 64-bit handle containing a 32-bit generation and 32-bit slot ID.
 */
export class Handle {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Returns the generation (high 32 bits) of the handle.
     */
    generation(): number;
    /**
     * Constructs a new Handle from a slot index and a generation.
     */
    constructor(slot: number, generation: number);
    /**
     * Returns the slot ID (low 32 bits) of the handle.
     */
    slot(): number;
    0: bigint;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_backendfacade_free: (a: number, b: number) => void;
    readonly __wbg_get_handle_0: (a: number) => bigint;
    readonly __wbg_handle_free: (a: number, b: number) => void;
    readonly __wbg_set_handle_0: (a: number, b: bigint) => void;
    readonly backendfacade_add_jump_ugp: (a: number, b: number, c: number) => number;
    readonly backendfacade_add_node: (a: number, b: number, c: number, d: number, e: number) => number;
    readonly backendfacade_add_ugp: (a: number, b: number, c: number) => number;
    readonly backendfacade_bezier_gen: (a: number) => number;
    readonly backendfacade_bind_ugp: (a: number, b: number, c: number, d: number) => void;
    readonly backendfacade_circle_gen: (a: number) => number;
    readonly backendfacade_connect_nodes: (a: number, b: number, c: number, d: number) => void;
    readonly backendfacade_copy_between_gen: (a: number) => number;
    readonly backendfacade_deserialize_dag: (a: number, b: number, c: number) => [number, number];
    readonly backendfacade_disconnect_nodes: (a: number, b: number, c: number, d: number) => void;
    readonly backendfacade_discrete_shape_gen: (a: number) => number;
    readonly backendfacade_export_dst: (a: number, b: number, c: number) => [number, number];
    readonly backendfacade_fill_gen: (a: number) => number;
    readonly backendfacade_get_node_operation: (a: number, b: number) => number;
    readonly backendfacade_get_node_params: (a: number, b: number) => [number, number];
    readonly backendfacade_get_ugp_x: (a: number, b: number) => number;
    readonly backendfacade_group_gen: (a: number) => number;
    readonly backendfacade_identity_gen: (a: number) => number;
    readonly backendfacade_ips_len: (a: number) => number;
    readonly backendfacade_ips_x: (a: number) => any;
    readonly backendfacade_ips_y: (a: number) => any;
    readonly backendfacade_is_jump_stitch: (a: number, b: number) => number;
    readonly backendfacade_line_fill_gen: (a: number) => number;
    readonly backendfacade_line_gen: (a: number) => number;
    readonly backendfacade_new: () => number;
    readonly backendfacade_rect_gen: (a: number) => number;
    readonly backendfacade_remove_node: (a: number, b: number) => void;
    readonly backendfacade_remove_ugp: (a: number, b: number) => void;
    readonly backendfacade_resample_path_gen: (a: number) => number;
    readonly backendfacade_reset: (a: number) => void;
    readonly backendfacade_rotate_gen: (a: number) => number;
    readonly backendfacade_run: (a: number) => void;
    readonly backendfacade_select_jump_gen: (a: number) => number;
    readonly backendfacade_serialize_dag: (a: number) => [number, number];
    readonly backendfacade_set_node_params: (a: number, b: number, c: number, d: number) => void;
    readonly backendfacade_shape_array: (a: number) => any;
    readonly backendfacade_shape_array_len: (a: number) => number;
    readonly backendfacade_unbind_ugp_all: (a: number, b: number) => void;
    readonly backendfacade_update_node_ports: (a: number, b: number, c: number) => void;
    readonly backendfacade_update_ugp: (a: number, b: number, c: number, d: number) => void;
    readonly handle_generation: (a: number) => number;
    readonly handle_new: (a: number, b: number) => number;
    readonly handle_slot: (a: number) => number;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __externref_table_dealloc: (a: number) => void;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
