/* @ts-self-types="./backend.d.ts" */

/**
 * Facade for the backend WASM module.
 *
 * The class exposes a simplified interface for the backend system, handling node management and parameter passing.
 */
export class BackendFacade {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        BackendFacadeFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_backendfacade_free(ptr, 0);
    }
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
     * @param {number} x
     * @param {number} y
     * @returns {Handle}
     */
    add_jump_ugp(x, y) {
        const ret = wasm.backendfacade_add_jump_ugp(this.__wbg_ptr, x, y);
        return Handle.__wrap(ret);
    }
    /**
     * Add a node to the DAG.
     *
     * ## Parameters:
     *
     * - **ports**: the number of ports for the node,
     * - **operation**: the number specifying the generator function index
     * - **params**: and a list of 5 parameters of type float. This is where you would indicate the spacing parameter.
     * If more than five parameters are given, the additional ones are ignored
     * @param {number} ports
     * @param {number} operation
     * @param {Float32Array} params
     * @returns {Handle}
     */
    add_node(ports, operation, params) {
        const ptr0 = passArrayF32ToWasm0(params, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.backendfacade_add_node(this.__wbg_ptr, ports, operation, ptr0, len0);
        return Handle.__wrap(ret);
    }
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
     * @param {number} x
     * @param {number} y
     * @returns {Handle}
     */
    add_ugp(x, y) {
        const ret = wasm.backendfacade_add_ugp(this.__wbg_ptr, x, y);
        return Handle.__wrap(ret);
    }
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
     * @returns {number}
     */
    bezier_gen() {
        const ret = wasm.backendfacade_bezier_gen(this.__wbg_ptr);
        return ret;
    }
    /**
     * Bind a UGP to a specific port of a node.
     *
     * ## Parameters:
     *
     * - **node_id**: a handle that corresponds to the node
     * - **port**: the port number that the UGP will be bound to
     * - **ugp_id**: the handle of the UGP to be bound
     * @param {Handle} node_id
     * @param {number} port
     * @param {Handle} ugp_id
     */
    bind_ugp(node_id, port, ugp_id) {
        _assertClass(node_id, Handle);
        _assertClass(ugp_id, Handle);
        wasm.backendfacade_bind_ugp(this.__wbg_ptr, node_id.__wbg_ptr, port, ugp_id.__wbg_ptr);
    }
    /**
     * Generates points along a circle centered at the first input point,
     * with radius determined by the distance to the second input point.
     *
     * - **Port 0**: Center point (first point used)
     * - **Port 1**: Radius point (first point used to calculate distance from center)
     * - **Param 0**: Spacing between points (distance between consecutive points)
     *
     * Returns error if prerequisites not met, or issue with radius and spacing input
     * @returns {number}
     */
    circle_gen() {
        const ret = wasm.backendfacade_circle_gen(this.__wbg_ptr);
        return ret;
    }
    /**
     * Create a directed edge in the DAG from a source node to the port of a target node.
     * Conceptually, it means that the output of the source node will be used as part of the input of the target node.
     *
     * ## Parameters:
     *
     * - **source**: a handle corresponding to the source node
     * - **target**: a handle corresponding to the target node
     * - **port**: the port number that of the target node.
     * @param {Handle} source
     * @param {Handle} target
     * @param {number} port
     */
    connect_nodes(source, target, port) {
        _assertClass(source, Handle);
        _assertClass(target, Handle);
        wasm.backendfacade_connect_nodes(this.__wbg_ptr, source.__wbg_ptr, target.__wbg_ptr, port);
    }
    /**
     * Tiles a pattern shape along a polyline by fitting one copy per segment.
     *
     * - **Port 0**: pattern shape points
     * - **Port 1**: path polyline points (one copy of the pattern is placed per consecutive pair)
     *
     * Returns an error if either port is empty.
     * @returns {number}
     */
    copy_between_gen() {
        const ret = wasm.backendfacade_copy_between_gen(this.__wbg_ptr);
        return ret;
    }
    /**
     * Deserializes a DAG string into the backend's internal state and re-creates the DAG.
     *
     * This function is intended for use in loading a DAG state from disk or receiving it over a network.
     * The frontend should use the [`serialize_dag`] function to obtain the string representation of the DAG state.
     *
     * This function will clear the current DAG state before deserializing the new one.
     * @param {string} data
     */
    deserialize_dag(data) {
        const ptr0 = passStringToWasm0(data, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.backendfacade_deserialize_dag(this.__wbg_ptr, ptr0, len0);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * Remove the directed edge in the DAG that exists between two nodes.
     *
     * ## Parameters:
     *
     * - **souce**: a handle corresponding to the source node of the edge to be removed.
     * - **target**: a handle corresponding to the target node of the edge to be removed.
     * - **port**: the port number that the edge was established on in the target node.
     * @param {Handle} source
     * @param {Handle} target
     * @param {number} port
     */
    disconnect_nodes(source, target, port) {
        _assertClass(source, Handle);
        _assertClass(target, Handle);
        wasm.backendfacade_disconnect_nodes(this.__wbg_ptr, source.__wbg_ptr, target.__wbg_ptr, port);
    }
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
     * @returns {number}
     */
    discrete_shape_gen() {
        const ret = wasm.backendfacade_discrete_shape_gen(this.__wbg_ptr);
        return ret;
    }
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
     * @param {Uint32Array} order
     * @returns {Uint8Array}
     */
    export_dst(order) {
        const ptr0 = passArray32ToWasm0(order, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.backendfacade_export_dst(this.__wbg_ptr, ptr0, len0);
        var v2 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v2;
    }
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
     * @returns {number}
     */
    fill_gen() {
        const ret = wasm.backendfacade_fill_gen(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get the generator of a node.
     *
     * ## Parameters:
     *
     * - **handle**: a handle corresponding to the node whose operation is needed.
     *
     * **Returns**: a number that corresponds to a specific generator of the node — the
     * operation index into the `GENERATORS` array.
     * @param {Handle} handle
     * @returns {number | undefined}
     */
    get_node_operation(handle) {
        _assertClass(handle, Handle);
        const ret = wasm.backendfacade_get_node_operation(this.__wbg_ptr, handle.__wbg_ptr);
        return ret === Number.MAX_SAFE_INTEGER ? undefined : ret;
    }
    /**
     * Get the list of parameters of a node.
     *
     * ## Parameters:
     *
     * - **handle**: the handle of the node to look at.
     *
     * **Returns**: an array of floats corresponding to the parameters of the node. Null if the handle is invalid.
     * @param {Handle} handle
     * @returns {Float32Array | undefined}
     */
    get_node_params(handle) {
        _assertClass(handle, Handle);
        const ret = wasm.backendfacade_get_node_params(this.__wbg_ptr, handle.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getArrayF32FromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        }
        return v1;
    }
    /**
     * Returns the x-coordinate of a UGP.
     *
     * ## Parameters:
     *
     * - **handle**: the handle of the UGP to look at.
     *
     * **Returns**: the UGP's x value, or `None` if the handle is invalid.
     * @param {Handle} handle
     * @returns {number | undefined}
     */
    get_ugp_x(handle) {
        _assertClass(handle, Handle);
        const ret = wasm.backendfacade_get_ugp_x(this.__wbg_ptr, handle.__wbg_ptr);
        return ret === Number.MAX_SAFE_INTEGER ? undefined : ret;
    }
    /**
     * Groups two input point sequences together, with the first sequence ending at the jump point.
     *
     * - **Port 0**: first point sequence
     * - **Port 1**: second point sequence
     *
     * The output will contain all the points from both `Port 0` and `Port 1`, with the first point of `Port 1` marked as a jump ending point.
     *
     * Returns an error if prerequisites are not met.
     * @returns {number}
     */
    group_gen() {
        const ret = wasm.backendfacade_group_gen(this.__wbg_ptr);
        return ret;
    }
    /**
     * Passes the input points directly to the output.
     *
     * - **Port 0**: List of points to pass through.
     * @returns {number}
     */
    identity_gen() {
        const ret = wasm.backendfacade_identity_gen(this.__wbg_ptr);
        return ret;
    }
    /**
     * Returns the number of interpolated points (IPs) that the DAG generated.
     * @returns {number}
     */
    ips_len() {
        const ret = wasm.backendfacade_ips_len(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Returns a view of the float array that corresponds to the x values of all the IPs.
     * @returns {Float32Array}
     */
    ips_x() {
        const ret = wasm.backendfacade_ips_x(this.__wbg_ptr);
        return ret;
    }
    /**
     * Returns a view of the float array that corresponds to the y values of all the IPs.
     * @returns {Float32Array}
     */
    ips_y() {
        const ret = wasm.backendfacade_ips_y(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} index
     * @returns {boolean}
     */
    is_jump_stitch(index) {
        const ret = wasm.backendfacade_is_jump_stitch(this.__wbg_ptr, index);
        return ret !== 0;
    }
    /**
     * Takes a list of points and connects them with new points forming lines.
     * Could be thought of as a running stitch for straight segments.
     *
     * - **Port 0**: List of points to connect.
     * - **Param 0**: spacing between interpolated points
     *
     * Returns error if prerequisites not met
     * @returns {number}
     */
    line_fill_gen() {
        const ret = wasm.backendfacade_line_fill_gen(this.__wbg_ptr);
        return ret;
    }
    /**
     * Generates evenly spaced points along a line from two endpoints points.
     *
     * - **Port 0**: start point (x, y)
     * - **Port 1**: end point (x, y)
     * - **Param 0**: spacing between interpolated points
     *
     * Returns error if prerequisites not met
     * @returns {number}
     */
    line_gen() {
        const ret = wasm.backendfacade_line_gen(this.__wbg_ptr);
        return ret;
    }
    constructor() {
        const ret = wasm.backendfacade_new();
        this.__wbg_ptr = ret;
        BackendFacadeFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Generates a rectangle shape from the top-left and bottom-right points.
     *
     * - **Port 0**: top-left point
     * - **Port 1**: bottom-right point
     *
     * Returns an error if prerequisites are not met.
     * @returns {number}
     */
    rect_gen() {
        const ret = wasm.backendfacade_rect_gen(this.__wbg_ptr);
        return ret;
    }
    /**
     * Remove a node from the DAG.
     *
     * ## Parameters:
     *
     * - **handle**: the handle of the node to remove
     * @param {Handle} handle
     */
    remove_node(handle) {
        _assertClass(handle, Handle);
        wasm.backendfacade_remove_node(this.__wbg_ptr, handle.__wbg_ptr);
    }
    /**
     * Discard a UGP in the backend.
     *
     * ## Parameters:
     *
     * - **handle**: the handle of the UGP to remove.
     * @param {Handle} handle
     */
    remove_ugp(handle) {
        _assertClass(handle, Handle);
        wasm.backendfacade_remove_ugp(this.__wbg_ptr, handle.__wbg_ptr);
    }
    /**
     * Resamples a path to a given target spacing, with optional corner threshold for sharp turns.
     *
     * - **Port 0**: The path to resample.
     * - **Param 0**: The target spacing between resampled points.
     * - **Param 1**: The optional corner threshold in radians for detecting sharp turns. If this is left at 0.0, the corner threshold will be set to 45 degrees. If this threshold is not set correctly, the corners of the shape may end up getting rounded off.
     *
     * If the path to be resampled contains jumps, the generator will automatically resample each segment independently, and maintain the jumps.
     * @returns {number}
     */
    resample_path_gen() {
        const ret = wasm.backendfacade_resample_path_gen(this.__wbg_ptr);
        return ret;
    }
    /**
     * Resets the DAG to an empty state, clearing all data.
     */
    reset() {
        wasm.backendfacade_reset(this.__wbg_ptr);
    }
    /**
     * Rotates a shape around an anchor point.
     *
     * - **Port 0**: points of the shape
     * - **Port 1**: anchor point
     * - **Port 2**: rotation angle point
     *
     * Returns an error with insufficient input.
     * @returns {number}
     */
    rotate_gen() {
        const ret = wasm.backendfacade_rotate_gen(this.__wbg_ptr);
        return ret;
    }
    /**
     * Recalculate the DAG.
     *
     * Retrieve inputs, feed them through the DAG, re-run generator functions, then insert a
     * jump stitch between the end of each shape and the start of the next one so consecutive
     * shapes aren't connected by a stitch.
     * Everytime something in the DAG changes, this function needs to be called.
     */
    run() {
        wasm.backendfacade_run(this.__wbg_ptr);
    }
    /**
     * Marks an input point at a specific index as a jump point. The index will indicate the jump ending point.
     *
     * - **Port 0**: input points
     * - **Param 0**: jump end point index.
     *
     * The output will contain all the points in `Port 0`, with the point at index `Param 0` marked as a jump ending point.
     *
     * Returns an error if prerequisites are not met.
     * @returns {number}
     */
    select_jump_gen() {
        const ret = wasm.backendfacade_select_jump_gen(this.__wbg_ptr);
        return ret;
    }
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
     * @returns {string}
     */
    serialize_dag() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.backendfacade_serialize_dag(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Update the parameters of a node in the DAG.
     *
     * ## Parameters:
     *
     * - **handle**: the handle of the node whose parameters to update
     * - **params**: a float array of the 5 new parameters. If there are more than 5 they are ignored.
     * @param {Handle} handle
     * @param {Float32Array} params
     */
    set_node_params(handle, params) {
        _assertClass(handle, Handle);
        const ptr0 = passArrayF32ToWasm0(params, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.backendfacade_set_node_params(this.__wbg_ptr, handle.__wbg_ptr, ptr0, len0);
    }
    /**
     * Returns a view of the shape array that corresponds to the shapes that the DAG generated.
     *
     * The `Shape` structs are flattened into a single `u32` array for efficiency. Each `Shape` is represented by 9 `u32` values.
     *
     * The reader of this array should interpret it as `[terminal_node_slot, terminal_node_generation, operation, points_offset, points_len, jumps_offset, jumps_len, colors_offset, colors_len]` and reconstruct the `Shape` structs from it.
     * @returns {Uint32Array}
     */
    shape_array() {
        const ret = wasm.backendfacade_shape_array(this.__wbg_ptr);
        return ret;
    }
    /**
     * Returns the number of shapes that the DAG generated.
     * @returns {number}
     */
    shape_array_len() {
        const ret = wasm.backendfacade_shape_array_len(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Unbind a UGP from all nodes it was bound to.
     *
     * ## Parameters:
     *
     * - **ugp_id**: the handle of the ugp to unbind
     * @param {Handle} ugp_id
     */
    unbind_ugp_all(ugp_id) {
        _assertClass(ugp_id, Handle);
        wasm.backendfacade_unbind_ugp_all(this.__wbg_ptr, ugp_id.__wbg_ptr);
    }
    /**
     * Updates the number of ports on a node.
     *
     * ## Parameters:
     *
     * - **handle**: the handle of the node to update
     * - **ports**: the new number of ports for the node
     * @param {Handle} handle
     * @param {number} ports
     */
    update_node_ports(handle, ports) {
        _assertClass(handle, Handle);
        wasm.backendfacade_update_node_ports(this.__wbg_ptr, handle.__wbg_ptr, ports);
    }
    /**
     * Update the x and y values of a UGP.
     *
     * ## Parameters:
     *
     * - **handle**: the handle of the UGP to edit.
     * - **x**: new x value (float).
     * - **y**: new y value (float).
     * @param {Handle} handle
     * @param {number} x
     * @param {number} y
     */
    update_ugp(handle, x, y) {
        _assertClass(handle, Handle);
        wasm.backendfacade_update_ugp(this.__wbg_ptr, handle.__wbg_ptr, x, y);
    }
}
if (Symbol.dispose) BackendFacade.prototype[Symbol.dispose] = BackendFacade.prototype.free;

/**
 * A bit-packed 64-bit handle containing a 32-bit generation and 32-bit slot ID.
 */
export class Handle {
    static __wrap(ptr) {
        const obj = Object.create(Handle.prototype);
        obj.__wbg_ptr = ptr;
        HandleFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        HandleFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_handle_free(ptr, 0);
    }
    /**
     * @returns {bigint}
     */
    get 0() {
        const ret = wasm.__wbg_get_handle_0(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * Returns the generation (high 32 bits) of the handle.
     * @returns {number}
     */
    generation() {
        const ret = wasm.handle_generation(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Constructs a new Handle from a slot index and a generation.
     * @param {number} slot
     * @param {number} generation
     */
    constructor(slot, generation) {
        const ret = wasm.handle_new(slot, generation);
        this.__wbg_ptr = ret;
        HandleFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Returns the slot ID (low 32 bits) of the handle.
     * @returns {number}
     */
    slot() {
        const ret = wasm.handle_slot(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {bigint} arg0
     */
    set 0(arg0) {
        wasm.__wbg_set_handle_0(this.__wbg_ptr, arg0);
    }
}
if (Symbol.dispose) Handle.prototype[Symbol.dispose] = Handle.prototype.free;
function __wbg_get_imports() {
    const import0 = {
        __proto__: null,
        __wbg___wbindgen_throw_344f42d3211c4765: function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
        },
        __wbg_error_a6fa202b58aa1cd3: function(arg0, arg1) {
            let deferred0_0;
            let deferred0_1;
            try {
                deferred0_0 = arg0;
                deferred0_1 = arg1;
                console.error(getStringFromWasm0(arg0, arg1));
            } finally {
                wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
            }
        },
        __wbg_new_227d7c05414eb861: function() {
            const ret = new Error();
            return ret;
        },
        __wbg_stack_3b0d974bbf31e44f: function(arg0, arg1) {
            const ret = arg1.stack;
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbindgen_cast_0000000000000001: function(arg0, arg1) {
            // Cast intrinsic for `Ref(Slice(F32)) -> NamedExternref("Float32Array")`.
            const ret = getArrayF32FromWasm0(arg0, arg1);
            return ret;
        },
        __wbindgen_cast_0000000000000002: function(arg0, arg1) {
            // Cast intrinsic for `Ref(Slice(U32)) -> NamedExternref("Uint32Array")`.
            const ret = getArrayU32FromWasm0(arg0, arg1);
            return ret;
        },
        __wbindgen_cast_0000000000000003: function(arg0, arg1) {
            // Cast intrinsic for `Ref(String) -> Externref`.
            const ret = getStringFromWasm0(arg0, arg1);
            return ret;
        },
        __wbindgen_init_externref_table: function() {
            const table = wasm.__wbindgen_externrefs;
            const offset = table.grow(4);
            table.set(0, undefined);
            table.set(offset + 0, undefined);
            table.set(offset + 1, null);
            table.set(offset + 2, true);
            table.set(offset + 3, false);
        },
    };
    return {
        __proto__: null,
        "./backend_bg.js": import0,
    };
}

const BackendFacadeFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_backendfacade_free(ptr, 1));
const HandleFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_handle_free(ptr, 1));

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
}

function getArrayF32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getFloat32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
}

function getArrayU32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

let cachedDataViewMemory0 = null;
function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

let cachedFloat32ArrayMemory0 = null;
function getFloat32ArrayMemory0() {
    if (cachedFloat32ArrayMemory0 === null || cachedFloat32ArrayMemory0.byteLength === 0) {
        cachedFloat32ArrayMemory0 = new Float32Array(wasm.memory.buffer);
    }
    return cachedFloat32ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
    return decodeText(ptr >>> 0, len);
}

let cachedUint32ArrayMemory0 = null;
function getUint32ArrayMemory0() {
    if (cachedUint32ArrayMemory0 === null || cachedUint32ArrayMemory0.byteLength === 0) {
        cachedUint32ArrayMemory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachedUint32ArrayMemory0;
}

let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function passArray32ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 4, 4) >>> 0;
    getUint32ArrayMemory0().set(arg, ptr / 4);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function passArrayF32ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 4, 4) >>> 0;
    getFloat32ArrayMemory0().set(arg, ptr / 4);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }
    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = cachedTextEncoder.encodeInto(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function takeFromExternrefTable0(idx) {
    const value = wasm.__wbindgen_externrefs.get(idx);
    wasm.__externref_table_dealloc(idx);
    return value;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

const cachedTextEncoder = new TextEncoder();

if (!('encodeInto' in cachedTextEncoder)) {
    cachedTextEncoder.encodeInto = function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    };
}

let WASM_VECTOR_LEN = 0;

let wasmModule, wasmInstance, wasm;
function __wbg_finalize_init(instance, module) {
    wasmInstance = instance;
    wasm = instance.exports;
    wasmModule = module;
    cachedDataViewMemory0 = null;
    cachedFloat32ArrayMemory0 = null;
    cachedUint32ArrayMemory0 = null;
    cachedUint8ArrayMemory0 = null;
    wasm.__wbindgen_start();
    return wasm;
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);
            } catch (e) {
                const validResponse = module.ok && expectedResponseType(module.type);

                if (validResponse && module.headers.get('Content-Type') !== 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else { throw e; }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);
    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };
        } else {
            return instance;
        }
    }

    function expectedResponseType(type) {
        switch (type) {
            case 'basic': case 'cors': case 'default': return true;
        }
        return false;
    }
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (module !== undefined) {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();
    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }
    const instance = new WebAssembly.Instance(module, imports);
    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (module_or_path !== undefined) {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (module_or_path === undefined) {
        module_or_path = new URL('backend_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync, __wbg_init as default };
