import Attraction from '../models/Attraction.js'

export async function getAttractions(req, res) {
  try {
    const filter = {}
    if (req.query.category) filter.category = req.query.category
    if (req.query.region) filter.region = new RegExp(req.query.region, 'i')
    if (req.query.search) {
      const re = new RegExp(req.query.search, 'i')
      filter.$or = [{ name: re }, { shortDescription: re }, { tags: re }]
    }
    const attractions = await Attraction.find(filter).sort({ rating: -1 })
    res.json(attractions)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export async function getAttraction(req, res) {
  try {
    const attraction = await Attraction.findById(req.params.id)
    if (!attraction) return res.status(404).json({ message: 'Attraction not found' })
    res.json(attraction)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export async function createAttraction(req, res) {
  try {
    const attraction = await Attraction.create(req.body)
    res.status(201).json(attraction)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

export async function updateAttraction(req, res) {
  try {
    const attraction = await Attraction.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    })
    if (!attraction) return res.status(404).json({ message: 'Attraction not found' })
    res.json(attraction)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

export async function deleteAttraction(req, res) {
  try {
    const attraction = await Attraction.findByIdAndDelete(req.params.id)
    if (!attraction) return res.status(404).json({ message: 'Attraction not found' })
    res.json({ message: 'Attraction deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
