// Wasm module example

const std = @import("std");
const expect = std.testing.expect;

pub export fn example(
    data: [*]i16,
    dataLength: usize,
    result: [*]u8
) usize {

    // const allocator = std.heap.wasm_allocator;
    const allocator = std.heap.page_allocator;

    const dynamic_var = allocator.alloc(i16, dataLength) catch unreachable;
    defer allocator.free(dynamic_var);

    @memcpy(dynamic_var, data);

    for (dynamic_var, 0..dataLength) |_, i| {
        dynamic_var[i] += @intCast(i);
    }

    var total: usize = 0;
    for (result, 0..dataLength) |_, i| {
        result[i] = @intCast(dynamic_var[i]);
        total += @intCast(dynamic_var[i]);
    }

    return total;
}

test "example" {
    const dataLength: usize = 4;
    var data = [_]i16 {1} ** dataLength;
    var result = [_]u8{0} ** dataLength;
    var total: usize = 0;
    total = example(&data, dataLength, &result);
    std.debug.print("\nDebug! result = {any}\n", .{result});
    std.debug.print("Debug! total = {}\n", .{total});
    try expect(10 == total);
}
