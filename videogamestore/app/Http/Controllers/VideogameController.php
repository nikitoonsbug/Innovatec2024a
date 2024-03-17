<?php

namespace App\Http\Controllers;

use App\Models\Videogame;
use App\Models\Videogame_purchase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class VideogameController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $videogames = DB::table('videogames')->get();
        return $videogames;
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        if (Videogame::where('name', $request->name)->exists() && Videogame::where('')->exists()) {
            return response()->json(['error' => 'The name already exists.'], 422);
        }


        $rules = [
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'image' => 'required|string|max:255',
            'release_date' => 'required|date',
            'stock' => 'required|integer',
            'price' => 'required|float',
            'physical' => 'required|boolean',
            'digital' => 'required|boolean',
            'id_category' => 'required|exists:book_categories,id',
            'id_platform' => 'required|exists:platforms,id',
            'developer' => 'required|string|max:255',
            'publisher' => 'required|string|max:255',

        ];


        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }


        $videogame = Videogame::create([
            'name' => $request->name,
            'description' => $request->description,
            'image' => $request->image,
            'release_date' => $request->release_date,
            'stock' => $request->stock,
            'price' => $request->price,
            'physical' => $request->physical,
            'digital' => $request->digital,
            'id_category' => $request->id_category,
            'id_platform' => $request->id_platform,
            'developer' => $request->developer,
            'publisher' => $request->publisher,

        ]);
        return response()->json(['message' => 'Success created videogame'], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request)
    {
        $query = Videogame::query();

        if ($request->has('name')) {
            $query->where('name', 'like', '%' . $request->input('name') . '%');
        }

        if ($request->has('description')) {
            $query->where('description', 'like', '%' . $request->input('description') . '%');
        }

        if ($request->has('image')) {
            $query->where('image', 'like', '%' . $request->input('image') . '%');
        }

        if ($request->has('release_date')) {
            $query->where('release_date', 'like', '%' . $request->input('release_date') . '%');
        }

        if ($request->has('stock')) {
            $query->where('stock', 'like', '%' . $request->input('stock') . '%');
        }

        if ($request->has('price')) {
            $query->where('price', 'like', '%' . $request->input('price') . '%');
        }

        if ($request->has('physical')) {
            $query->where('physical', 'like', '%' . $request->input('physical') . '%');
        }

        if ($request->has('digital')) {
            $query->where('digital', 'like', '%' . $request->input('digital') . '%');
        }

        if ($request->has('id_category')) {
            $query->where('id_category', 'like', '%' . $request->input('id_category') . '%');
        }

        if ($request->has('id_platform')) {
            $query->where('id_platform', 'like', '%' . $request->input('id_platform') . '%');
        }

        if ($request->has('developer')) {
            $query->where('developer', 'like', '%' . $request->input('developer') . '%');
        }

        if ($request->has('publisher')) {
            $query->where('publisher', 'like', '%' . $request->input('publisher') . '%');
        }

        $videogames = $query->get();

        return response()->json(['videogames' => $videogames], 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Videogame $videogame)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Videogame $videogame)
    {
        $rules = [
            'name' => $request->name,
            'description' => $request->description,
            'image' => $request->image,
            'release_date' => $request->release_date,
            'stock' => $request->stock,
            'price' => $request->price,
            'physical' => $request->physical,
            'digital' => $request->digital,
            'id_category' => $request->id_category,
            'id_platform' => $request->id_platform,
            'developer' => $request->developer,
            'publisher' => $request->publisher,
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $videogame = Videogame::where('id', $request->id)->first();

        $videogame->update([
            'name' => $request->name,
            'description' => $request->description,
            'image' => $request->image,
            'release_date' => $request->release_date,
            'stock' => $request->stock,
            'price' => $request->price,
            'physical' => $request->physical,
            'digital' => $request->digital,
            'id_category' => $request->id_category,
            'id_platform' => $request->id_platform,
            'developer' => $request->developer,
            'publisher' => $request->publisher,
        ]);

        return $videogame;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
       /*$videoGamePurchasesCount = Videogame_purchase::where('id_videogame', $request->id)->count();

        if ($videoGamePurchasesCount > 0) {
            return response()->json(['error' => 'Cannot delete videogame with associated purchases.'], 400);
        }
        */
        
        $videogame = Videogame::find($request->id);

        if (!$videogame) {
            return response()->json(['error' => 'Videogame not found.'], 404);
        }

        $videogame->delete();

        return response()->json(['message' => 'Videogame deleted successfully.']);
    }
    public function decrementStock($id)
    {
        $videogame = Videogame::find($id);

        if ($videogame) {
            $videogame->decrement('stock');
            return response()->json(['message' => 'Stock field decremented successfully'], 200);
        }

        return response()->json(['error' => 'Videogame not found'], 404);
    }
    public function IncrementStock($id)
    {
        $videogame = Videogame::find($id);

        if ($videogame) {
            $videogame->increment('stock');
            return response()->json(['message' => 'Stock field incremented successfully'], 200);
        }

        return response()->json(['error' => 'Videogame not found'], 404);
    }
}
